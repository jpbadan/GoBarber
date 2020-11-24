import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userUpdatingEmail = await this.usersRepository.findByEmail(email);

    if (userUpdatingEmail && userUpdatingEmail.id !== user_id) {
      throw new AppError('Email is already beeing used');
    }

    user.name = name;
    user.email = email;

    // Verifica se o old password foi informado junto à requisição
    if (password && !old_password) {
      throw new AppError(
        'Your old password must be informed when setting up a new password',
      );
    }

    if (password && old_password) {
      const validOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!validOldPassword) {
        throw new AppError('Old password is wrong');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}
export default UpdateProfileService;
