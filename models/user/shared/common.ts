import bcrypt from 'bcryptjs';

import config from '@/config';

import type { ComparePassword, GetUserPipeline } from '@/models/user/shared/common.types';
import type { PreMiddlewareFunction, PreSaveMiddlewareFunction } from 'mongoose';

const { AWS_URL } = config;

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const preChangePasswordHook: PreSaveMiddlewareFunction = async function (this, next) {
  try {
    if (this.password) {
      if (!this.isModified('password')) return void next();

      this.password = await hashPassword(this.password);
      next();
    }

    const password = this.get('password');
    if (password) {
      const hashedPassword = await hashPassword(password);
      this.set('password', hashedPassword);
      next();
    }
  } catch (err) {
    return void next(err as Error);
  }
};

export const preAggregateHook: PreMiddlewareFunction = async function (this, next) {
  this.append(
    ...[
      {
        $addFields: {
          fullName: { $concat: ['$firstName', ' ', '$lastName'] },
          avatarUrl: {
            $cond: [
              {
                $eq: ['$avatar', null],
              },
              null,
              {
                $concat: [AWS_URL, '/', '$avatar'],
              },
            ],
          },
        },
      },
      {
        $unset: ['password', 'emailLog'],
      },
    ]
  );
  next();
};

export const comparePassword: ComparePassword = async (user, hash) => bcrypt.compare(user, hash);

export const getUserPipeline: GetUserPipeline = ({ id, isPermissionsRequired = false }) => {
  const permissionsPipeline = [
    {
      $lookup: {
        from: 'permissions',
        localField: 'role.permissions',
        foreignField: '_id',
        as: 'role.permissions',
      },
    },
    {
      $addFields: {
        'role.permissions': {
          $filter: {
            input: '$role.permissions',
            as: 'permission',
            cond: {
              $and: [
                { $eq: ['$$permission.type', '$role.type'] },
                { $eq: ['$$permission.isActive', true] },
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        permissions: '$role.permissions',
      },
    },
  ];

  return [
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $match: id
        ? {
            $expr: {
              $eq: ['$_id', { $toObjectId: id }],
            },
          }
        : {},
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'role',
      },
    },
    {
      $unwind: '$role',
    },
    ...(isPermissionsRequired ? permissionsPipeline : []),
  ];
};
