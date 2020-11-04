import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  title: string;
  className?: string; // Permite que o tooltip receba a estilizacao por um parent desse componente -> estaremos importando o tooltip no styles do input
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  className = '',
  children,
}) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};
export default Tooltip;
