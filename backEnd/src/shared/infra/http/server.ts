/* eslint-disable no-console */
import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors'; // Permite tratativa de erros assíncronos.
// DEVE SER IMPORTADA LOGO APÓS A IMPORTAÇÃO DO EXPRESS.

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from '@shared/infra/http/routes';

import '@shared/infra/typeorm'; // Apenas carrega o arquivo database -> n contem exports
import '@shared/container';

const app = express();
const port = 3333;

app.use(cors()); // Evita que sites nao autenticados tenham acessos à api (ver docs). Só é necessário para requisições feitas atravez de browsers. Native e insomnia n usam o cors.
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory)); // Permite servir uma pasta estática pelo express
app.use(routes);

// Tratativa de erros: Middlewares para tttiva de erros teem 4 parametros. Variaveis _ n sao usadas -> Config personalizada eslint
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`🐓 GREAT SUCCESS! Server started on ${port}`);
});
