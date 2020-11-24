import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('Should be able to show profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Rodrigo Ferreira');
    expect(profile.email).toBe('Rodrigo@gmail.com');
  });

  it('Should not be able to show profile of non existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
