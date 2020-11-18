import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendPasswordRecoveryMailService from './SendPasswordRecoveryMailService';

describe('SendPasswordRecoveryMail', () => {
  it('Should be able to send password recovery email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const sendPasswordRecoveryMail = new SendPasswordRecoveryMailService(
      fakeUsersRepository,
      fakeMailProvider,
    );

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
});
