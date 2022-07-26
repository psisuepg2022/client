import React, { useCallback, useState } from 'react';
import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material';
import debounce from 'lodash.debounce';

type AutocompleteProps = {
  callback: (inputValue: string) => Promise<any>;
  label: string;
  noOptionsText: string;
}


const AutocompleteInput = ({ callback, label, noOptionsText }: AutocompleteProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const handleDebounce = async (inputValue: string): Promise<void> => {
    setLoading(true);
    const res = await callback(inputValue);
    setOptions([...res.data]);
    setLoading(false);
  }
  
  const debounceFn = useCallback(debounce(handleDebounce, 500), []);

  const handleInputChange = useCallback(async (value: string) => {
    if (value.length < 3) 
      return;
    debounceFn(value);
  }, [])

  return (
    <Autocomplete
      id="asynchronous-autocomplete"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      loadingText="Buscando..."
      noOptionsText={noOptionsText}
      filterOptions={x => x}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => `${option.name}`}
      onChange={(e, value, reason) => {
        if (reason === 'clear') setOptions([])
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
          label={label}
          onChange={(e) => handleInputChange(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default AutocompleteInput;