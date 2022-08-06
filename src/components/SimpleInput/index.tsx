import { TextFieldProps } from '@mui/material';
import React from 'react';
import { CustomTextField } from './styles';

type SimpleInputProps = {
  name: string;
  label: string;
  type?: string;
  mask?: (value: string) => string;
} & TextFieldProps;

const SimpleInput = ({
  label,
  contentEditable,
  defaultValue,
  value,
  disabled,
  mask,
  ...rest
}: SimpleInputProps): JSX.Element => {
  return (
    <CustomTextField
      {...rest}
      autoComplete="off"
      label={label}
      defaultValue={defaultValue}
      contentEditable={contentEditable}
      value={mask ? mask(`${value}` || '') : value || ''}
      disabled={disabled}
    />
  );
};

export default SimpleInput;
