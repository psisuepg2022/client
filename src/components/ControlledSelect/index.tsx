import React from 'react';
import { FormControl, SelectProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { StyledInputLabel, StyledSelect } from './styles';

type ControlledSelectProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: number | string;
} & SelectProps;

const ControlledSelect = ({
  name,
  label,
  required,
  disabled,
  defaultValue,
  ...rest
}: ControlledSelectProps): JSX.Element => {
  const { control } = useFormContext();

  return (
    <Controller
      {...rest}
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({ field: { value, onChange, onBlur } }) => (
        <FormControl>
          <StyledInputLabel>{label}</StyledInputLabel>
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
            label={label}
          />
        </FormControl>
      )}
    />
  );
};

export default React.memo(ControlledSelect);
