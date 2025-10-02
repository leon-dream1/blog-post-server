import { JwtPayload } from 'jsonwebtoken';
import { TBlog } from './blog.interface';
import { User } from '../User/user.model';
import { Blog } from './blog.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

const getAllBlogFromDB = async (query: Record<string, unknown>) => {
  const copyQueryObj = { ...query };

  // search by field title or content
  let searchTerm = '';

  if (copyQueryObj?.search) {
    searchTerm = copyQueryObj?.search as string;
  }

  const searchableFields = ['title', 'content'];

  const searchQuery = Blog.find({
    $or: searchableFields.map((searchItem) => ({
      [searchItem]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  // filter by author

  if (copyQueryObj.filter) {
    // convert "filter" param into author field
    copyQueryObj.author = new mongoose.Types.ObjectId(
      copyQueryObj?.filter as string,
    );
    delete copyQueryObj.filter;
  }

  const excludeFields = ['search', 'sortBy', 'sortOrder'];
  excludeFields.forEach((field) => delete copyQueryObj[field]);

  const filterQuery = searchQuery.find(copyQueryObj);

  // sortby

  const sortBy = (query.sortBy as string) || 'createdAt';
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1;

  const sortQuery = await filterQuery
    .sort({ [sortBy]: sortOrder })
    .populate('author', 'name email -_id');
  return sortQuery;
};

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

const deleteBlogFromDB = async (user: JwtPayload, blogId: string) => {
  const isBlogExists = await Blog.findById(blogId);
  if (!isBlogExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Blog not found');
  }

  const tokenUser = await User.findOne({ email: user?.email });

  if (!isBlogExists?.author.equals(tokenUser?._id)) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const result = await Blog.findByIdAndDelete(blogId);
  return result;
};

// admin work
const deleteBlogFromDByAdmin = async (blogId: string) => {
  const isBlogExists = await Blog.findById(blogId);
  if (!isBlogExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Blog not found');
  }

  const result = await Blog.findByIdAndDelete(blogId);
  return result;
};

const blockUserFromDbByAdmin = async (userId: string) => {
  const isUserExists = await User.findById(userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const result = await User.findByIdAndUpdate(
    userId,
    {
      isBlocked: true,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

export const blogServices = {
  createBlogIntoDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
  deleteBlogFromDByAdmin,
  blockUserFromDbByAdmin,
  getAllBlogFromDB,
};
