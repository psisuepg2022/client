import React, { useState } from 'react';
import { IconButton, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CustomTextField } from './styles';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';

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
                {visibility ? (
                  <MdOutlineVisibility />
                ) : (
                  <MdOutlineVisibilityOff />
                )}
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
