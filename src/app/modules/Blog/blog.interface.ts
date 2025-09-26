import { Types } from 'mongoose';

export type TBlog = {
  title: string;
  content: string;
  author?: Types.ObjectId;
  isPublished?: boolean;
};

// title: string – The title of the blog post.
// content: string – The main body or content of the blog post.
// author: ObjectId – A reference to the User model, indicating the author of the blog post.
// isPublished: boolean – A flag indicating whether the blog post is published. Default is true (published).
// createdAt: Date – The timestamp when the blog post was created.
// updatedAt: Date – The timestamp of the last update to the blog post.
