import React from 'react';
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { CustomTextField } from './styles';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

type InputErrorProps = {
  message: string;
  value: boolean;
};

type ControlledTimePickerProps = {
  name: string;
  label: string;
  disabled?: boolean;
  defaultValue?: string;
  required?: boolean;
  rules?: Omit<
    RegisterOptions<FieldValues, FieldPath<FieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
};

const ControlledTimePicker = ({
  name,
  label,
  disabled,
  defaultValue,
  rules,
  required,
  ...rest
}: ControlledTimePickerProps): JSX.Element => {
  const { control, formState, getFieldState } = useFormContext();

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
        <LocalizationProvider adapterLocale={ptBR} dateAdapter={AdapterDateFns}>
          <TimePicker
            {...rest}
            label={label}
            value={value}
            onChange={onChange}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                required={required}
                helperText={getError().message}
                error={getError().value}
              />
            )}
            disabled={disabled}
            inputFormat="HH:mm"
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default ControlledTimePicker;
