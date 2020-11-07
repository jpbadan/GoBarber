import React from 'react';

import GlobalStyle from './styles/global';
import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';

// Disponivel na aplicação inteira
import AppProvider from './hooks';

const App: React.FC = () => (
  <>
    {/* Todos os componentes dentro do componente AuthContext.provider iram ter acesso ao nosso context. */}
    <AppProvider>
      <SignIn />
    </AppProvider>

    <GlobalStyle />
  </>
);

export default App;
