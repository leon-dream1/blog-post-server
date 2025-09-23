import { userControllers } from './user.controller';
import { userValidationSchema } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import { Router } from 'express';

const router = Router();

router.post(
  '/register',
  validateRequest(userValidationSchema.userRegisterValidationSchema),
  userControllers.registerUser,
);

export const userRoutes = router;
