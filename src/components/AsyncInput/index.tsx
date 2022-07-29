import React, { ChangeEvent } from 'react';
import { CircularProgress, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CustomTextField } from './styles';
import { CepInfos } from '../../interfaces';

type AsyncInputProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string | number;
  type?: string;
  mask?: (value: string) => string;
  onCompleteCep?: (value: string) => Promise<CepInfos | void>;
  inputLoading: boolean;
  maxLength?: number;
} & TextFieldProps;

const AsyncInput = ({
  name,
  label,
  required,
  disabled,
  defaultValue,
  type = 'text',
  mask,
  inputLoading,
  onCompleteCep,
  maxLength,
  ...rest
}: AsyncInputProps): JSX.Element => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <CustomTextField
          {...rest}
          autoComplete="off"
          onChange={(
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            onChange(event);
            onCompleteCep && onCompleteCep(event.target.value);
          }}
          value={mask ? mask(value) : value}
          required={required}
          disabled={disabled}
          label={label}
          type={type}
          InputProps={{
            endAdornment: inputLoading && (
              <CircularProgress size={20} color="primary" />
            ),
          }}
          inputProps={{
            maxLength: maxLength,
          }}
          // helperText={helperText}
          // error={error}
        />
      )}
    />
  );
};

export default AsyncInput;
