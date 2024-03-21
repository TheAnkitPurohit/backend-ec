import constants from '@/constants/constants';
import errorController from '@/helpers/error.controller';
import logger from '@/middlewares/logger.middleware';
import app from '@/middlewares/middleware';
import routes from '@/routes/routes';
import notFoundRoute from '@/routes/shared/notFound.route';

app.use('/api', routes);

app.use(/^\/$/, (req, res) => res.send(constants.SITE_HANDSHAKE()));

// IF NO ROUTES MATCHING ABOVE THAN IT WILL DISPLAY BELOW ROUTE
app.use(notFoundRoute);

// IF YOU PASS ARGUMENT IN NEXT FUNCTION, IT WILL AUTOMATICALLY GOTO ERROR HANDLER BY EXPRESS
app.use(logger.errorLogger);
app.use(errorController);

export default app;
