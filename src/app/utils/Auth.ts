import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import { RoleType } from '../modules/User/user.constant';
import AppError from '../errors/AppError';
import config from '../../config';
import { User } from '../modules/User/user.model';

const auth = (...requiredRoles: RoleType[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.JWT_ACCESS_SECRET as string,
    ) as JwtPayload;

    const { role, email } = decoded;

    // checking if the user is exist
    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted

    const isBlocked = isUserExists?.isBlocked;

    if (isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
    }

    // role is matched or not
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
