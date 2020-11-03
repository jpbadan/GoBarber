import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

// Type no fim das contas é uma interface vazia
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container type="button" {...rest}>
    {/* props sobrescreve o type="button" caso esteja lá definido */}
    {children}
  </Container>
);

export default Button;
