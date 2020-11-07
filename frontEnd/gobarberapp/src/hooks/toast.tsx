import React, { createContext, useCallback, useContext, useState } from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const Toast = createContext<ToastData>({} as ToastData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]); // Armazena as várias mensagens que podem estar sendo exibidas em tela ao mesmo tempo

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };

      // setMessages([...messages, toast]); -> Requer adicionar messages no array de dependencias. Outra opção é:
      setMessages(state => [...state, toast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <Toast.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </Toast.Provider>
  );
};

function useToast(): ToastData {
  const context = useContext(Toast);

  if (!context) {
    throw new Error('useToast() must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
