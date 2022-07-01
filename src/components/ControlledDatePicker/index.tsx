import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CustomTextField } from './styles';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

type ControlledDatePickerProps = {
  name: string;
  label: string;
  disabled?: boolean;
  defaultValue?: string | number;
};

const ControllerDatePicker = ({
  name,
  label,
  disabled,
  defaultValue,
  ...rest
}: ControlledDatePickerProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({ field: { value, onChange } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            {...rest}
            label={label}
            value={value}
            onChange={onChange}
            renderInput={(params) => <CustomTextField {...params} />}
            disabled={disabled}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default ControllerDatePicker;
