import React, { useCallback, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import debounce from 'lodash.debounce';
import { Patient, Person } from '../../types';

type AutocompleteProps = {
  callback: (inputValue: string) => Promise<Person[]>;
  label: string;
  noOptionsText: string;
  selectCallback: (value: Person | Patient) => void;
};

const AutocompleteInput = ({
  callback,
  label,
  noOptionsText,
  selectCallback,
}: AutocompleteProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const alreadyUsed = useRef(false);

  const handleDebounce = async (inputValue: string): Promise<void> => {
    alreadyUsed.current = true;
    setLoading(true);
    const patients = await callback(inputValue);
    setOptions([...patients]);
    setLoading(false);
  };

  const debounceFn = useCallback(debounce(handleDebounce, 500), []);

  const handleInputChange = useCallback(async (value: string) => {
    if (value.length < 3) return;
    debounceFn(value);
  }, []);

  return (
    <Autocomplete
      id="asynchronous-autocomplete"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      loadingText="Buscando..."
      noOptionsText={
        alreadyUsed.current ? noOptionsText : 'Insira 3 caracteres para buscar'
      }
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => `${option.name}`}
      onChange={(e, value, reason) => {
        if (reason === 'clear') setOptions([]);
        else selectCallback(value as Patient);
      }}
      options={options}
      loading={loading}
      renderOption={(props, option) => (
        <Box {...props} component="li" key={option.id}>
          <Typography>{option.name}</Typography>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={label}
          onChange={(e) => handleInputChange(e.target.value)}
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
        />
      )}
    />
  );
};

export default AutocompleteInput;
