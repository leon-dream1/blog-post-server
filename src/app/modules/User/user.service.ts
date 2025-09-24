import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config';

const saveUserToDB = async (userData: TUser) => {
  const result = await User.create(userData);
  return result;
};

const loginUserToDB = async (email: string, password: string) => {
  // check if user exists or not
  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials!');
  }

  // check if user blocked or not
  if (isUserExists?.isBlocked === true) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials!');
  }
  // check password is match or not
  const passwordMatched = await bcrypt.compare(
    password,
    isUserExists?.password,
  );
  if (!passwordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials!');
  }

  // create token and send to client
  const jwtPayload = {
    email: isUserExists?.email,
    role: isUserExists?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET as string, {
    expiresIn: '10d',
  });

  // const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET as string, {
  //   expiresIn: config.JWT_EXPIRES_IN as string,
  // });
  return accessToken;
};

export const userServices = {
  saveUserToDB,
  loginUserToDB,
};
