import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let AuthenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    AuthenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to Authenticate', async () => {
    const user = await createUser.execute({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    const response = await AuthenticateUser.execute({
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to Authenticate with non existing user', async () => {
    expect(
      AuthenticateUser.execute({
        email: 'Rodrigo@gmail.com',
        password: 'Rod123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to Authenticate with a wrong password', async () => {
    await createUser.execute({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    expect(
      AuthenticateUser.execute({
        email: 'Rodrigo@gmail.com',
        password: 'Rod123458',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
