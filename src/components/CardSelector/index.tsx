import { colors } from '@global/colors';
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
  professionals?: boolean;
};

const CardSelector = ({
  name,
  selected,
  onSelect,
  style,
  textStyle,
  disabled,
  professionals,
}: CardSelectorProps): JSX.Element => {
  return (
    <Container
      style={
        selected
          ? {
              borderBottom: '3px #419D78 solid',
              backgroundColor: professionals ? colors.BACKGREY : '#FFF',
              borderRadius: 3,
              ...style,
            }
          : { ...style }
      }
      disabled={disabled}
      onClick={onSelect}
    >
      <Tooltip enterDelay={1000} enterNextDelay={1000} title={name}>
        <CardName
          style={
            selected ? { fontWeight: 500, ...textStyle } : { ...textStyle }
          }
        >
          {name}
        </CardName>
      </Tooltip>
    </Container>
  );
};

export default CardSelector;
