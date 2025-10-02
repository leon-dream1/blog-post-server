import { Router } from 'express';
import { blogControllers } from './blog.controller';
import auth from '../../utils/Auth';
import { Role } from '../User/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidationSchema } from './blog.validation';

const router = Router();

router.post(
  '/',
  auth(Role.user),
  validateRequest(BlogValidationSchema.createBlogValidationSchema),
  blogControllers.createBlog,
);

router.patch(
  '/:blogId',
  auth(Role.user),
  validateRequest(BlogValidationSchema.updateBlogValidationSchema),
  blogControllers.updateBlog,
);

router.delete('/:blogId', auth(Role.user), blogControllers.deleteBlog);

// delete by admin
router.delete(
  '/blogs/:blogId',
  auth(Role.admin),
  blogControllers.deleteBlogByAdmin,
);

router.patch(
  '/users/:userId/block',
  auth(Role.admin),
  blogControllers.blockUserByAdmin,
);

export const blogRoutes = router;
