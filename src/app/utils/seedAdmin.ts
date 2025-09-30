import { Role } from '../modules/User/user.constant';
import { TUser } from '../modules/User/user.interface';
import { User } from '../modules/User/user.model';

export const seedAdmin = async () => {
  const adminData: TUser = {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'admin1234',
    role: Role.ADMIN,
    isBlocked: false,
  };

  await User.create(adminData);
};
