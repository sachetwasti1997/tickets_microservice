import express, { NextFunction, Request, Response } from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler } from '@ticketingplatform/common';
import { NotFoundError } from '@ticketingplatform/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});

app.use(errorHandler);
export {app}