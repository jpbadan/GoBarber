import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GlobalStyle from './styles/global';

// Disponivel na aplicação inteira
import AppProvider from './hooks';

import Routes from './routes';

const App: React.FC = () => (
  <BrowserRouter>
    {/* Todos os componentes dentro do componente AuthContext.provider iram ter acesso ao nosso context. */}
    <AppProvider>
      <Routes />
    </AppProvider>

    <GlobalStyle />
  </BrowserRouter>
);

export default App;
