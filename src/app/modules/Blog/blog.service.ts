import { JwtPayload } from 'jsonwebtoken';
import { TBlog } from './blog.interface';
import { User } from '../User/user.model';
import { Blog } from './blog.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createBlogIntoDB = async (userData: JwtPayload, blogData: TBlog) => {
  const user = await User.findOne({ email: userData?.email });

  const blogDataWithAuthor = {
    ...blogData,
    author: user?._id,
  };

  const result = await Blog.create(blogDataWithAuthor);
  return result;
};

const updateBlogIntoDB = async (
  user: JwtPayload,
  blogId: string,
  payload: Partial<TBlog>,
) => {
  const isBlogExists = await Blog.findById(blogId);
  if (!isBlogExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Blog not found');
  }

  const tokenUser = await User.findOne({ email: user?.email });

  if (!isBlogExists?.author.equals(tokenUser?._id)) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const result = await Blog.findByIdAndUpdate(blogId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const blogServices = { createBlogIntoDB, updateBlogIntoDB };
