import { Request, Response } from 'express';
import { userServices } from './user.service';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;

  const result = await userServices.saveUserToDB(userData);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'User registered successfully',
    data: {
      _id: result._id,
      name: result.name,
      email: result.email,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await userServices.loginUserToDB(email, password);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      token: result,
    },
  });
});

export const userControllers = {
  registerUser,
  loginUser,
};
