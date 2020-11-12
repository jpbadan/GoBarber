import User from '@modules/users/infra/typeorm/entities/User';

type SafeUser = Omit<User, 'password'>;

const renderUserSafe = (user: User): SafeUser => {
  return user as SafeUser;
};

export default renderUserSafe;
