import config from '../../../config';
import AppError from '../../errors/AppError';
import { TRole } from '../User/user.constant';
import { User } from '../User/user.model';
import { TBlog } from './blog.interface';
import { Blog } from './blog.model';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';

const createBlogIntoDB = async (accessToken: string, blogData: TBlog) => {
  if (!accessToken) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized!');
  }

  const decoded = jwt.verify(
    accessToken,
    config.JWT_ACCESS_SECRET as string,
  ) as JwtPayload;

  const { email } = decoded;

  const isUserExists = await User.findOne({ email });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (isUserExists?.isBlocked === true) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials!');
  }

  if (isUserExists?.role !== TRole.USER) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  blogData.author = isUserExists?._id;

  const result = await Blog.create(blogData);
  return result;
};

export const blogServices = { createBlogIntoDB };
