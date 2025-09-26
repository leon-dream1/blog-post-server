import z from 'zod';

const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    content: z.string(),
    author: z.string().optional(),
    isPublished: z.boolean().optional().default(true),
  }),
});

export const BlogValidationSchema = {
  createBlogValidationSchema,
};
