import React, { useState } from 'react';
import { IconButton, TextFieldProps } from '@mui/material';
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { CustomTextField } from './styles';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';

type ControlledInputProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string | number;
  type?: string;
  mask?: (value: string) => string;
  maxLength?: number;
  rules?: Omit<
    RegisterOptions<FieldValues, FieldPath<FieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
} & TextFieldProps;

type ErrorProps = {
  message: string;
  status: boolean;
};

const ControlledInput = ({
  name,
  label,
  required,
  disabled,
  defaultValue,
  type = 'text',
  mask,
  maxLength,
  rules,
  ...rest
}: ControlledInputProps): JSX.Element => {
  const { control, formState, getFieldState } = useFormContext();
  const [visibility, setVisibility] = useState<boolean>(type !== 'password');

  const getError = (): ErrorProps => {
    const fieldState = getFieldState(name, formState);
    console.log('ERORS', fieldState);

    if (fieldState.error && fieldState.error.message)
      return {
        status: true,
        message: fieldState.error.message,
      };
    return {
      status: false,
      message: '',
    };
  };

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <CustomTextField
          {...rest}
          onChange={onChange}
          value={mask ? mask(value || '') : value || ''}
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
          inputProps={{
            maxLength: maxLength,
          }}
          helperText={getError().message}
          error={getError().status}
        />
      )}
    />
  );
};

export default ControlledInput;
