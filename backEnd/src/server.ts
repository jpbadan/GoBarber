/* eslint-disable no-console */
import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors'; // Permite tratativa de erros assíncronos.
// DEVE SER IMPORTADA LOGO APÓS A IMPORTAÇÃO DO EXPRESS.

import routes from './routes';
import './database/index'; // Apenas carrega o arquivo -> n contem exports
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

const app = express();
const port = 3333;

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory)); // Permite servir uma pasta estática pelo express
app.use(routes);

// Tratativa de erros: Middlewares para tttiva de erros teem 4 parametros. Variaveis _ n sao usadas -> Config personalizada eslint
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`🐓🐓🐓 Server started on port ${port}`);
});
