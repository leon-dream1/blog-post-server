import { Router } from 'express';
import { blogControllers } from './blog.controller';
import auth from '../../utils/Auth';
import { Role } from '../User/user.constant';

const router = Router();

router.post('/', auth(Role.user), blogControllers.createBlog);

export const blogRoutes = router;
