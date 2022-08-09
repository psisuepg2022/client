/* eslint-disable quotes */
import React from 'react';
import {
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  ClinicTitle,
  Container,
  DayTitle,
  EarlyContent,
  LatterContent,
  MiddleContent,
  StyledInputLabel,
  StyledMenuItem,
  StyledSelect,
  TodayButton,
} from './styles';
import { AiOutlineUser, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { ToolbarProps, View } from 'react-big-calendar';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import CardSelector from '../CardSelector';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/Auth';

type CustomToolbarProps = {
  onRangeChange: (range: Date[], view?: View) => void;
} & ToolbarProps;

const TopToolbar = ({
  onRangeChange,
  onNavigate,
  onView,
  view,
  date,
}: CustomToolbarProps): JSX.Element => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToBack = () => {
    onNavigate('PREV');
  };

  const goToNext = () => {
    onNavigate('NEXT');
  };

  const goToCurrent = () => {
    onNavigate('TODAY');
    onView('day');
    onRangeChange([new Date()], 'day');
  };

  console.log('VIEW', view, date);

  const handleViewChange = (value: number): void => {
    switch (value) {
      case 0:
        onView('day');
        break;
      case 1:
        onView('week');
        break;
      case 2:
        onView('month');
        break;
    }
  };

  const label = () => {
    const toFormatDate = date;
    return (
      <DayTitle>
        {format(toFormatDate, "dd 'de' MMMM", { locale: ptBR })}{' '}
        {format(toFormatDate, 'yyyy', { locale: ptBR })}
      </DayTitle>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Container>
        <EarlyContent>
          <ClinicTitle>KLINIK</ClinicTitle>
        </EarlyContent>

        <MiddleContent>
          <IconButton onClick={goToBack}>
            <AiOutlineLeft style={{ color: '#FFF', fontSize: 30 }} />
          </IconButton>
          {label()}
          <IconButton onClick={goToNext}>
            <AiOutlineRight style={{ color: '#FFF', fontSize: 30 }} />
          </IconButton>
        </MiddleContent>

        <LatterContent>
          {(date.getDate() !== new Date().getDate() ||
            date.getMonth() !== new Date().getMonth() ||
            date.getFullYear() !== new Date().getFullYear()) && (
            <TodayButton onClick={goToCurrent} variant="outlined">
              Hoje
            </TodayButton>
          )}
          <FormControl>
            <StyledInputLabel shrink>Modo</StyledInputLabel>
            <StyledSelect
              name="mode"
              label="Modo"
              notched
              defaultValue={0}
              onChange={(e: SelectChangeEvent<unknown>) =>
                handleViewChange(e.target.value as number)
              }
              value={view === 'day' ? 0 : view === 'week' ? 1 : 2}
            >
              <StyledMenuItem value={0}>Dia</StyledMenuItem>
              <StyledMenuItem value={1}>Semana</StyledMenuItem>
              <StyledMenuItem value={2}>Mês</StyledMenuItem>
            </StyledSelect>
          </FormControl>
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
            sx={{ zIndex: 999 }}
          >
            <MenuItem onClick={() => navigate('/profile')}>Perfil</MenuItem>
            <hr />
            <MenuItem onClick={signOut}>Logout</MenuItem>
          </Menu>
        </LatterContent>
      </Container>
      <CardSelector /> {/* MOCK ONLY */}
    </div>
  );
};

export default TopToolbar;
