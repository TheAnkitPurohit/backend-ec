import config from '@/config';
import constants from '@/constants/constants';
import getUserOrAdminModel from '@/models/user/model';
import Email from '@/services/email.service';
import { AppError, isAppError } from '@/utils/appError';
import { decrypt, encrypt, generateEncryptToken, generateRandomToken } from '@/utils/security';

import type {
  CreateEmailLog,
  GetDecryptedEmailToken,
  GetEncryptedEmailToken,
  ResetEmailLog,
  SendEmail,
  VerifyEmailLog,
} from '@/types/services/email.types';

const { EMAIL_TOKEN_SECRET, EMAIL_TOKEN_EXPIRES_IN } = config;

const getEncryptedEmailToken: GetEncryptedEmailToken = id => {
  try {
    const token = generateRandomToken();
    const signedToken = JSON.stringify({ id: id.toString(), token });

    const encryptedToken = encrypt(
      signedToken,
      () => new AppError(constants.INVALID_TOKEN_ERROR, constants.UNAUTHORIZED)
    );

    return isAppError(encryptedToken) ? encryptedToken : { token, encryptedToken };
  } catch (e) {
    return new AppError(constants.TECHNICAL_ERROR, constants.SERVER_ERROR);
  }
};

export const getDecryptedEmailToken: GetDecryptedEmailToken = token => {
  try {
    const decryptedToken = decrypt(
      token,
      () => new AppError(constants.INVALID_TOKEN_ERROR, constants.UNAUTHORIZED)
    );

    return isAppError(decryptedToken) ? decryptedToken : JSON.parse(decryptedToken);
  } catch (e) {
    return new AppError(constants.EXPIRED_TOKEN_ERROR, constants.BAD_REQUEST);
  }
};

const resetEmailLog: ResetEmailLog = async (user, slug) => {
  const { _id: id, userType } = user;

  const Model = getUserOrAdminModel(userType);

  try {
    await Model.findOneAndUpdate(
      { _id: id, isActive: true },
      {
        $set: {
          'emailLog.$[el].status': constants.MAIL_INVALID(),
          'emailLog.$[el].token': null,
          'emailLog.$[el].expiresIn': null,
        },
      },
      {
        runValidators: true,
        projection: '_id',
        arrayFilters: [
          {
            'el.slug': slug,
            'el.status': constants.MAIL_SENT(),
          },
        ],
      }
    );

    return true;
  } catch (e) {
    console.log('Email Error', e);
    return false;
  }
};

export const createEmailLog: CreateEmailLog = async (user, log) => {
  const { _id: id, userType } = user;

  const Model = getUserOrAdminModel(userType);

  try {
    await resetEmailLog(user, log.slug);

    const data = await Model.findOneAndUpdate(
      { _id: id, isActive: true },
      {
        $push: { emailLog: log },
      },
      { runValidators: true, projection: '_id' }
    );

    return !!data;
  } catch (e) {
    console.log('Email Error', e);
    return false;
  }
};

export const verifyEmailLog: VerifyEmailLog = async (userType, log) => {
  const { id, slug, token, resetEverySlugEntries } = log;

  const Model = getUserOrAdminModel(userType);
  const hashedToken = generateEncryptToken(token, EMAIL_TOKEN_SECRET);

  if (resetEverySlugEntries) {
    await resetEmailLog({ _id: id, userType }, slug);
    return new AppError(resetEverySlugEntries, constants.BAD_REQUEST);
  }

  try {
    // ADDED SAME FIELDS IN FILTER OBJECT AND IN ARRAY FILTERS DUE TO RETURN CONDITION
    const data = await Model.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
        'emailLog.slug': slug,
        'emailLog.token': hashedToken,
        'emailLog.expiresIn': { $gt: Date.now() },
      },
      {
        $set: {
          'emailLog.$[el].status': constants.MAIL_SUCCESS(),
          'emailLog.$[el].token': null,
          'emailLog.$[el].expiresIn': null,
          'emailLog.$[el].fulfilledAt': new Date(),
        },
      },
      {
        runValidators: true,
        projection: '_id',
        arrayFilters: [
          {
            'el.slug': slug,
            'el.token': hashedToken,
            'el.expiresIn': { $gt: Date.now() },
          },
        ],
      }
    );

    return data ? true : new AppError(constants.EXPIRED_TOKEN_ERROR, constants.BAD_REQUEST);
  } catch (e) {
    return new AppError(constants.EXPIRED_TOKEN_ERROR, constants.BAD_REQUEST);
  }
};

const sendEmail: SendEmail = async (user, data) => {
  const { slug, email, noLog } = data;

  const emailToken = getEncryptedEmailToken(user._id);
  if (isAppError(emailToken)) return emailToken;

  const { token, encryptedToken } = emailToken;

  try {
    const Mail = new Email({
      ...email,
      extra: {
        ...email.extra,
        token: encryptedToken,
      },
    });

    const isSent = await Mail.sendEmail(slug);
    if (!isSent) {
      return new AppError(constants.NO_EMAIL_TEMPLATE_FOUND, constants.BAD_REQUEST);
    }

    if (noLog) return true;

    const isLogCreated = await createEmailLog(user, {
      slug,
      status: constants.MAIL_SENT(),
      token: generateEncryptToken(token, EMAIL_TOKEN_SECRET),
      expiresIn: new Date(Date.now() + +EMAIL_TOKEN_EXPIRES_IN * 60 * 1000),
    });

    return isLogCreated ? true : new AppError(constants.EMAIL_ERROR, constants.SERVER_ERROR);
  } catch (err) {
    if (!noLog) await createEmailLog(user, { slug, status: constants.MAIL_FAILED() });
    return new AppError(constants.EMAIL_ERROR, constants.SERVER_ERROR);
  }
};

export default sendEmail;
