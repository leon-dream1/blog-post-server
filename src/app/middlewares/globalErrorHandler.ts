/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import config from '../../config';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';

export type TErrorSources = {
  path: string;
  message: string;
}[];

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // default response
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = 'Something went wrong!';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err?.code === 11000) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err?.errmsg;
    errorSources = [
      {
        path: '',
        message: err?.errmsg,
      },
    ];
  } else if (err?.name === 'ZodError') {
    statusCode = httpStatus.BAD_REQUEST;
    const parsed = JSON.parse(err?.message);
    const msg = parsed[0]?.message;
    message = msg;
    errorSources = [
      {
        path: '',
        message: msg,
      },
    ];
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    // err,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
