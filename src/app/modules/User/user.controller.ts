import { Request, Response } from 'express';
import { userServices } from './user.service';
import catchAsync from '../../utils/catchAsync';
import hhtpStatus from 'http-status';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;

  const result = await userServices.saveUserToDB(userData);

  res.status(hhtpStatus.OK).json({
    success: true,
    message: 'User is created successfully',
    data: result,
  });
});

export const userControllers = {
  registerUser,
};
