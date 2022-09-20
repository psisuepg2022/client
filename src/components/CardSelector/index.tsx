import React from 'react';
import { CardName, Container } from './styles';

type CardSelectorProps = {
  name: string;
};

const CardSelector = ({ name }: CardSelectorProps): JSX.Element => {
  return (
    <Container>
      <CardName>{name}</CardName>
    </Container>
  );
};

export default CardSelector;
