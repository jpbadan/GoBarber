import React, { useCallback } from 'react';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

const SignUp: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSubmit = useCallback(async (data: object) => {
    try {
      // Validacao de dados com yup para validar objetos inteiros
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome Obrigatório'),
        email: Yup.string()
          .required('E-Mail Obrigatório')
          .email('Digite um E-Mail Válido'),
        password: Yup.string().min(6, 'Deve conter no mínimo 6 caracteres'),
      });

      await schema.validate(data, {
        // Evita que o Yup pare de rodar apos o primeiro erro:
        abortEarly: false,
      });
    } catch (err) {
      console.log('SignUp:React.FC -> err', err);
    }
  }, []);

  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="GoBarber" />

        {/* <Form initialData={{ name: 'Renato' }} onSubmit={handleSubmit}> */}
        <Form onSubmit={handleSubmit}>
          <h1>Faça o seu Cadastro</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <a href="logon">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
