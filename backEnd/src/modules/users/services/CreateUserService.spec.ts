import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('Should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create an new user using a already used email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    expect(
      createUser.execute({
        name: 'Rodrigo Mamede',
        email: 'Rodrigo@gmail.com',
        password: 'Med123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
