import { injectable, inject } from 'tsyringe';

// import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import { addHours, differenceInHours, isAfter } from 'date-fns';
import { compare } from 'bcryptjs';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private usersTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByToken(token);
    const resetExpireDelay = 2;

    if (!userToken) {
      throw new AppError('Inexistant user token');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('non existent user token');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, resetExpireDelay);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token Expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}
export default ResetPasswordService;
