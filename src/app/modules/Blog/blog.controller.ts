import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { blogServices } from './blog.service';
import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const blogData = req.body;

  const result = await blogServices.createBlogIntoDB(
    req.user as JwtPayload,
    blogData,
  );

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const updateBlogData = req.body;
  const { blogId } = req.params;

  const result = await blogServices.updateBlogIntoDB(
    req.user as JwtPayload,
    blogId as string,
    updateBlogData,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  await blogServices.deleteBlogFromDB(req.user as JwtPayload, blogId as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Blog deleted successfully',
    data: null,
  });
});

// admin routes
const deleteBlogByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  await blogServices.deleteBlogFromDByAdmin(blogId as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Blog deleted successfully',
    data: null,
  });
});

const blockUserByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  await blogServices.blockUserFromDbByAdmin(userId as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'User blocked successfully',
    data: null,
  });
});

export const blogControllers = {
  createBlog,
  updateBlog,
  deleteBlog,
  deleteBlogByAdmin,
  blockUserByAdmin,
};
