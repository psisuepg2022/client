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
import {
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdOutlineClose,
} from 'react-icons/md';

type InputErrorProps = {
  message: string;
  value: boolean;
};

type ControlledInputProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string | number;
  type?: string;
  mask?: (value: string) => string;
  maxLength?: number;
  endFunction?: string;
  rules?: Omit<
    RegisterOptions<FieldValues, FieldPath<FieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
} & TextFieldProps;

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
  endFunction,
  autoComplete,
  ...rest
}: ControlledInputProps): JSX.Element => {
  const { control, formState, getFieldState } = useFormContext();
  const [visibility, setVisibility] = useState<boolean>(type !== 'password');

  const getError = (): InputErrorProps => {
    const fieldState = getFieldState(name, formState);

    if (fieldState.error && fieldState.error.message)
      return {
        value: true,
        message: fieldState.error.message,
      };
    return {
      value: false,
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
          autoComplete={autoComplete || 'text'}
          onChange={onChange}
          value={mask ? mask(value || '') : value || ''}
          required={required}
          disabled={disabled}
          label={label}
          type={visibility ? 'text' : 'password'}
          InputProps={{
            endAdornment:
              endFunction === 'password' ? (
                <IconButton onClick={() => setVisibility((prev) => !prev)}>
                  {visibility ? (
                    <MdOutlineVisibility />
                  ) : (
                    <MdOutlineVisibilityOff />
                  )}
                </IconButton>
              ) : (
                endFunction === 'clear' && (
                  <IconButton onClick={() => onChange('')}>
                    <MdOutlineClose />
                  </IconButton>
                )
              ),
          }}
          inputProps={{
            maxLength: maxLength,
          }}
          helperText={getError().message}
          error={getError().value}
        />
      )}
    />
  );
};

export default ControlledInput;
