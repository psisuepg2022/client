import React from 'react';
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { CustomTextField } from './styles';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { InputErrorProps } from '../../types';

type ControlledDatePickerProps = {
  name: string;
  label: string;
  disabled?: boolean;
  defaultValue?: Date;
  rules?: Omit<
    RegisterOptions<FieldValues, FieldPath<FieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
};

const ControlledDatePicker = ({
  name,
  label,
  disabled,
  defaultValue,
  rules,
  ...rest
}: ControlledDatePickerProps): JSX.Element => {
  const { control, formState, getFieldState } = useFormContext();

  const getError = (): InputErrorProps => {
    const fieldState = getFieldState(name, formState);
    console.log('ERORS', fieldState);

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
        <LocalizationProvider adapterLocale={ptBR} dateAdapter={AdapterDateFns}>
          <DatePicker
            {...rest}
            label={label}
            value={value}
            onChange={onChange}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                helperText={getError().message}
                error={getError().value}
              />
            )}
            disabled={disabled}
            inputFormat="dd/MM/yyyy"
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default ControlledDatePicker;
