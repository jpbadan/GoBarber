import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({ email, password });

    delete user.password;

    console.log(
      '🔗',
      '\x1b[35m',
      user.name,
      '\x1b[0m',
      'Logged in. Very Nice!',
    );

    return response.json({ user, token });
  }
}
