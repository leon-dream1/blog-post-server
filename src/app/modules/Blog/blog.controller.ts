import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { blogServices } from './blog.service';
import { Request, Response } from 'express';

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const blogData = req.body;
  const accessToken = req?.headers?.authorization as string;

  const result = await blogServices.createBlogIntoDB(accessToken, blogData);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

export const blogControllers = {
  createBlog,
};
