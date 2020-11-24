import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendPasswordRecoveryMailService from '@modules/users/services/SendPasswordRecoveryMailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendPasswordRecoveryMail = container.resolve(
      SendPasswordRecoveryMailService,
    );

    await sendPasswordRecoveryMail.execute({ email });

    return response.status(204).json();
  }
}
