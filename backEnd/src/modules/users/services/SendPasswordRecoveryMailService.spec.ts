import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendPasswordRecoveryMailService from './SendPasswordRecoveryMailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendPasswordRecoveryMail: SendPasswordRecoveryMailService;

describe('SendPasswordRecoveryMail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendPasswordRecoveryMail = new SendPasswordRecoveryMailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('Should be able to send password recovery email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    await sendPasswordRecoveryMail.execute({
      email: 'Rodrigo@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it("Shouldn't be able to recover password for non existing user", async () => {
    await expect(
      sendPasswordRecoveryMail.execute({
        email: 'Rodrigo@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should generate a forgot password token', async () => {
    const generatedToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Ferreira',
      email: 'Rodrigo@gmail.com',
      password: 'Rod123456',
    });

    await sendPasswordRecoveryMail.execute({
      email: 'Rodrigo@gmail.com',
    });

    expect(generatedToken).toHaveBeenCalledWith(user.id);
  });
});
