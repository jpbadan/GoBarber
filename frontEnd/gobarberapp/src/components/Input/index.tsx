import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';
import { Container } from './styles';

// Permite que o nosso componente Input receba por default todos os parametros de um input HTML
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string; // Transforma o nome em parametro obrigatorio (o q n é o caso em HTML)
  icon?: React.ComponentType<IconBaseProps>; // Um tipo que permite receber componentes como parametros -> icon é opicional
}

// icon: Icon -> pois assim o react entende que se trata de um componente com a letra maiuscula.
const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  // Usar useCallback todas as vezes que se for criar uma função em um component
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // [] => Vazio desta forma a função do useCallback nunca será recriada
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
    // ^^^ Equivalente a:
    // if (inputRef.current?.value) {
    //   setIsFilled(true);
    // } else {
    //   setIsFilled(false);
    // }
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container isFilled={isFilled} isFocused={isFocused}>
      {Icon && <Icon size={20} />}
      {/* Se o Icon existir -> <Icon size={20} /> */}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
    </Container>
  );
};

export default Input;
