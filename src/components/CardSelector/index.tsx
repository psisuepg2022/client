import { Tooltip } from '@mui/material';
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
      <Tooltip title={name}>
        <CardName style={{ ...textStyle }}>{name}</CardName>
      </Tooltip>
    </Container>
  );
};

export default CardSelector;
