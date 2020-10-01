/* eslint-disable no-console */
import 'reflect-metadata';

import express from 'express';
import routes from './routes';

import './database/index'; // Apenas carrega o arquivo -> n contem exports
import uploadConfig from './config/upload';

const app = express();
const port = 3333;

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory)); // Permite servir uma pasta estática pelo express
app.use(routes);

app.listen(port, () => {
  console.log(`🐓🐓🐓 Server started on port ${port}`);
});
