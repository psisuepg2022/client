import React from 'react';
import {
  DatePicker,
  DatePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

type SimpleDatePickerProps = {
  name: string;
  label: string;
  disabled?: boolean;
  defaultValue?: Date;
} & DatePickerProps<Date, Date>;

const SimpleDatePicker = ({
  label,
  disabled,
  renderInput,
  value,
  ...rest
}: SimpleDatePickerProps): JSX.Element => {
  return (
    <LocalizationProvider adapterLocale={ptBR} dateAdapter={AdapterDateFns}>
      <DatePicker
        {...rest}
        label={label}
        value={value}
        renderInput={renderInput}
        disabled={disabled}
        inputFormat="dd/MM/yyyy"
      />
    </LocalizationProvider>
  );
};

export default SimpleDatePicker;
