import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const newPassword = '12345678';

    await resetPassword.execute({
      token,
      password: newPassword,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith(newPassword);
    expect(updatedUser?.password).toBe(newPassword);
  });

  it("Shouldn't be able to reset password with non existent token", async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existent-token',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to reset password with non existent user", async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user-id',
    );

    await expect(
      resetPassword.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to reset password after time delay (2h) is expired", async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const newPassword = '12345678';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    }); // injeta a arrow function na função date.now

    await expect(
      resetPassword.execute({
        token,
        password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
