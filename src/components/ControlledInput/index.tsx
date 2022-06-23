import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CustomTextField } from './styles';

type ControlledInputProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string | number;
  type?: string;
} & TextFieldProps;

const ControlledInput = ({
  name,
  label,
  required,
  disabled,
  defaultValue,
  type = 'text',
  ...rest
}: ControlledInputProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [visibility, setVisibility] = useState<boolean>(type !== 'password');

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({ field: { value, onChange } }) => (
        <CustomTextField
          {...rest}
          onChange={onChange}
          value={value || ''}
          required={required}
          disabled={disabled}
          label={label}
          type={visibility ? 'text' : 'password'}
          InputProps={{
            endAdornment: type === 'password' && (
              <IconButton onClick={() => setVisibility((prev) => !prev)}>
                {visibility ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            ),
          }}
          // helperText={helperText}
          // error={error}
        />
      )}
    />
  );
};

export default ControlledInput;
