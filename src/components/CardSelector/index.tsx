import React from 'react';
import { CardName, Container } from './styles';

type CardSelectorProps = {
  name: string;
  selected: boolean;
  onSelect: () => void;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
};

const CardSelector = ({
  name,
  selected,
  onSelect,
  style,
  textStyle,
}: CardSelectorProps): JSX.Element => {
  return (
    <Container
      style={
        selected
          ? { borderBottom: '2px #419D78 solid', ...style }
          : { ...style }
      }
      onClick={onSelect}
    >
      <CardName style={{ ...textStyle }}>{name}</CardName>
    </Container>
  );
};

export default CardSelector;
