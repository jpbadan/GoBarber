import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Rodrigo Abdulah',
      email: 'Rodrigo.abdu@gmail.com',
    });

    expect(updatedUser.name).toBe('Rodrigo Abdulah');
    expect(updatedUser.email).toBe('Rodrigo.abdu@gmail.com');
  });

  it("Shouldn't be able to update email with an already used one", async () => {
    await fakeUsersRepository.create({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Fake Rody',
      email: 'FakeRody@gmail.com',
      password: 'Rod123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Rodrigo Abdulah',
        email: 'Rodrigo@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Rodrigo Abdulah',
      email: 'Rodrigo.abdu@gmail.com',
      old_password: 'Rod123456',
      password: 'Rod123',
    });

    expect(updatedUser.password).toBe('Rod123');
  });

  it("Shouldn't be able to update password without informing the old password", async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Rodrigo Abdulah',
        email: 'Rodrigo.abdu@gmail.com',
        password: 'Rod123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Shouldn't be able to update password informing the wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Rodrigo Abdulah',
        email: 'Rodrigo.abdu@gmail.com',
        old_password: 'A_Wrong_PW',
        password: 'Rod123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
