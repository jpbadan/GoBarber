import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
  // Esses nomes sao facilmente encontrados usando um console.log do decoded.
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT is missing!', 401);
  }

  // Token: Bearer hjfdskhfjksghhg2432hgj324ghj

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    // 'as' Quando precisar forçar o tipo de uma var podemos usar esse hack to TS:
    const { sub } = decoded as TokenPayload;

    // Disponibilizamos o id do usuarios nas props da rota:
    request.user = {
      id: sub,
    };

    return next();
  } catch {
    // Customizamos o nosso erro. Para n ficarmos com o erro default da verify()
    throw new AppError('Invalid JWT Token', 401);
  }
}
