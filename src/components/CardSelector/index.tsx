import React from 'react';
import { CardName, Container } from './styles';

type CardSelectorProps = {
  name: string;
  selected: boolean;
  onSelect: () => void;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  disabled?: boolean;
};

const CardSelector = ({
  name,
  selected,
  onSelect,
  style,
  textStyle,
  disabled,
}: CardSelectorProps): JSX.Element => {
  return (
    <Container
      style={
        selected
          ? { borderBottom: '2px #419D78 solid', ...style }
          : { ...style }
      }
      disabled={disabled}
      onClick={onSelect}
    >
      <CardName style={{ ...textStyle }}>{name}</CardName>
    </Container>
  );
};

export default CardSelector;
