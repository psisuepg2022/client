import React, { useCallback, useRef, useState } from 'react';
import { Autocomplete, Box, CircularProgress, Typography } from '@mui/material';
import debounce from 'lodash.debounce';
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { StyledTextfield } from './styles';
import { Person } from '@models/Person';
import { Patient } from '@models/Patient';

type InputErrorProps = {
  message: string;
  value: boolean;
};

type ControlledAutocompleteProps = {
  callback: (inputValue: string) => Promise<Person[]>;
  label: string;
  noOptionsText: string;
  selectCallback: (value: Person | Patient) => void;
  cleanseAfterSelect?: () => void;
  defaultValue?: string;
  name: string;
  required?: boolean;
  rules?: Omit<
    RegisterOptions<FieldValues, FieldPath<FieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
};

const ControlledAutocompleteInput = ({
  callback,
  label,
  noOptionsText,
  selectCallback,
  cleanseAfterSelect,
  name,
  defaultValue,
  required,
  rules,
}: ControlledAutocompleteProps): JSX.Element => {
  const { control, getFieldState, formState } = useFormContext();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const alreadyUsed = useRef(false);
  const createMode = useRef(false);

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

  const handleDebounce = async (inputValue: string): Promise<void> => {
    alreadyUsed.current = true;
    setLoading(true);
    const patients = await callback(inputValue);
    setOptions([...patients]);
    setLoading(false);
  };

  const debounceFn = useCallback(debounce(handleDebounce, 500), []);

  const handleInputChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (value: string, onChange: (event: any) => void) => {
      onChange(value);
      if (value.length < 3 || createMode.current) return;
      debounceFn(value);
    },
    []
  );

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <Autocomplete
          id="asynchronous-autocomplete-controlled"
          open={open && !createMode.current}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          loadingText="Buscando..."
          noOptionsText={
            alreadyUsed.current
              ? noOptionsText
              : 'Insira no mínimo 3 caracteres para buscar'
          }
          filterOptions={(x) => x}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          getOptionLabel={(option) => `${(option as Person).name || option}`}
          onInputChange={(e, value, reason) => {
            if (reason === 'input') {
              handleInputChange(value, onChange);
            }
          }}
          onChange={(e, value, reason) => {
            selectCallback(value);
            if (reason === 'clear') {
              if (cleanseAfterSelect) cleanseAfterSelect();
              setOptions([]);
            }
          }}
          value={value}
          options={options}
          loading={loading}
          renderOption={(props, option) => (
            <Box {...props} component="li" key={option.id}>
              <Typography>
                {!option.id ? `Criar "${option.name}"` : option.name}
              </Typography>
            </Box>
          )}
          selectOnFocus
          freeSolo
          renderInput={(params) => (
            <StyledTextfield
              {...params}
              fullWidth
              label={label}
              required={required}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              error={getError().value}
              helperText={getError().message}
            />
          )}
        />
      )}
    />
  );
};

export default React.memo(ControlledAutocompleteInput);
