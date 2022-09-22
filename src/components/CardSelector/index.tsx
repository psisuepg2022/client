import React from 'react';
import { CardName, Container } from './styles';

type CardSelectorProps = {
  name: string;
  selected: boolean;
  onSelect: () => void;
};

const CardSelector = ({
  name,
  selected,
  onSelect,
}: CardSelectorProps): JSX.Element => {
  return (
    <Container
      style={selected ? { borderBottom: '2px #419D78 solid' } : {}}
      onClick={onSelect}
    >
      <CardName>{name}</CardName>
    </Container>
  );
};

export default CardSelector;
