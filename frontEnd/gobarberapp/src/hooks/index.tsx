import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';

// Provê todos os hooks globais da aplicação
const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
);

export default AppProvider;
