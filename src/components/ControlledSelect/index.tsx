import React from 'react';
import { FormControl, FormHelperText, SelectProps } from '@mui/material';
import {
  Controller,
  RegisterOptions,
  useFormContext,
  FieldValues,
  FieldPath,
} from 'react-hook-form';
import { StyledInputLabel, StyledSelect } from './styles';

type InputErrorProps = {
  message: string;
  value: boolean;
};

type ControlledSelectProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: number | string;
  rules?: Omit<
    RegisterOptions<FieldValues, FieldPath<FieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
} & SelectProps;

const ControlledSelect = ({
  name,
  label,
  required,
  disabled,
  defaultValue,
  rules,
  ...rest
}: ControlledSelectProps): JSX.Element => {
  const { control, getFieldState, formState } = useFormContext();

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
      {...rest}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      control={control}
      render={({ field: { value, onChange, onBlur } }) => (
        <FormControl error={getError().value}>
          <StyledInputLabel required={required}>{label}</StyledInputLabel>
          <StyledSelect
            {...rest}
            sx={{
              '&:focus .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000',
              },
            }}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            autoWidth
            variant="outlined"
            required={required}
            disabled={disabled}
            error={getError().value}
            label={label}
          />
          <FormHelperText error={getError().value}>
            {getError().message}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default React.memo(ControlledSelect);
