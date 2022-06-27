import React, { useState } from 'react';
import {
  FormControl,
  IconButton,
  InputLabel,
  menuItemClasses,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import {
  ClinicTitle,
  Container,
  DayTitle,
  EarlyContent,
  LatterContent,
  MiddleContent,
  StyledMenuItem,
  StyledSelect,
  TodayButton,
} from './styles';
import { AiOutlineUser } from 'react-icons/ai';

const TopToolbar = (): JSX.Element => {
  console.log('MENU', menuItemClasses);
  const [value, setValue] = useState<number>(0);

  return (
    <Container>
      <EarlyContent>
        <ClinicTitle>KLINIK</ClinicTitle>
      </EarlyContent>

      <MiddleContent>
        <DayTitle>6 de junho de 2022</DayTitle>
      </MiddleContent>

      <LatterContent>
        <TodayButton variant="outlined">Hoje</TodayButton>

        <FormControl>
          <InputLabel id="select-label" style={{ color: '#FFF' }}>
            Modo
          </InputLabel>
          <StyledSelect
            label="Modo"
            value={value}
            defaultValue={0}
            onChange={(e: SelectChangeEvent<unknown>) =>
              setValue(e.target.value as number)
            }
            size="small"
            labelId="select-label"
            sx={{
              borderColor: '#FFF',
              '& .MuiSvgIcon-root': {
                color: '#FFF',
              },
            }}
            MenuProps={{
              sx: {
                '&& .Mui-selected': {
                  backgroundColor: '#d4d4d4',
                },
              },
            }}
          >
            <StyledMenuItem value={0}>Dia</StyledMenuItem>
            <StyledMenuItem value={1}>Semana</StyledMenuItem>
            <StyledMenuItem value={2}>Mês</StyledMenuItem>
          </StyledSelect>
        </FormControl>

        <IconButton>
          <AiOutlineUser style={{ fontSize: 40, color: '#FFF' }} />
        </IconButton>
      </LatterContent>
    </Container>
  );
};

export default TopToolbar;
