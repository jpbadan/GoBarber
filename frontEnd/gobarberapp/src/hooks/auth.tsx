import React, { createContext, useCallback, useContext, useState } from 'react';

import api from '../services/api';

interface AuthState {
  token: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

// Uma info que deve ser acessivel de varios locais. {} as AuthContext -> Hack para burlar as tipagens do TS:
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Criação de metodos acessiveis atraves do context:
export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    // Verifica se o local storage ja contem infos de autenticacao
    const token = localStorage.getItem('@GoBaber:token');
    const user = localStorage.getItem('@GoBaber:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });
    const { token, user } = response.data;

    localStorage.setItem('@GoBaber:token', token);
    localStorage.setItem('@GoBaber:user', JSON.stringify(user));

    setData({ token, user }); // O useState ja foi rodado anteriormente
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBaber:token');
    localStorage.removeItem('@GoBaber:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  // Permite refatorar useContext(AuthContext) -> useAuth()
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
