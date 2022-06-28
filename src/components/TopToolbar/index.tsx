import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import {
  ClinicTitle,
  Container,
  DayTitle,
  EarlyContent,
  LatterContent,
  MiddleContent,
  StyledMenuItem,
  TodayButton,
} from './styles';
import { AiOutlineUser, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledSelect from '../ControlledSelect';

const TopToolbar = (): JSX.Element => {
  const formMethods = useForm();
  const {} = formMethods;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container>
      <EarlyContent>
        <ClinicTitle>KLINIK</ClinicTitle>
      </EarlyContent>

      <MiddleContent>
        <IconButton>
          <AiOutlineLeft style={{ color: '#FFF', fontSize: 30 }} />
        </IconButton>
        <DayTitle>6 de junho de 2022</DayTitle>
        <IconButton>
          <AiOutlineRight style={{ color: '#FFF', fontSize: 30 }} />
        </IconButton>
      </MiddleContent>

      <LatterContent>
        <TodayButton variant="outlined">Hoje</TodayButton>

        <FormProvider {...formMethods}>
          <ControlledSelect name="mode" label="Modo" defaultValue={0}>
            <StyledMenuItem value={0}>Dia</StyledMenuItem>
            <StyledMenuItem value={1}>Semana</StyledMenuItem>
            <StyledMenuItem value={2}>Mês</StyledMenuItem>
          </ControlledSelect>
        </FormProvider>

        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            open ? handleClose() : handleClick(e)
          }
        >
          <AiOutlineUser style={{ fontSize: 40, color: '#FFF' }} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem>Perfil</MenuItem>
          <hr />
          <MenuItem>Logout</MenuItem>
        </Menu>
      </LatterContent>
    </Container>
  );
};

export default TopToolbar;
