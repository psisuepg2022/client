import React from 'react';
import { StyledButton } from './styles';

type ButtonProps = {
  name: string;
};

const Button = ({ name }: ButtonProps): JSX.Element => {
  return <StyledButton>{name}</StyledButton>;
};

export default Button;
