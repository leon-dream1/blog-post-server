import { JwtPayload } from 'jsonwebtoken';
import { TBlog } from './blog.interface';
import { User } from '../User/user.model';
import { Blog } from './blog.model';

const createBlogIntoDB = async (userData: JwtPayload, blogData: TBlog) => {
  const user = await User.findOne({ email: userData?.email });

  const blogDataWithAuthor = {
    ...blogData,
    author: user?._id,
  };

  const result = await Blog.create(blogDataWithAuthor);
  return result;
};

export const blogServices = { createBlogIntoDB };
