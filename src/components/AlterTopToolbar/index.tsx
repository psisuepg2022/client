/* eslint-disable quotes */
import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { ClinicTitle, Container, EarlyContent, LatterContent } from './styles';
import { AiOutlineUser } from 'react-icons/ai';
import { FaUserCog, FaUserMd, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/Auth';

const AlterTopToolbar = (): JSX.Element => {
  const {
    signOut,
    user: { clinic, permissions },
  } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Container>
        <EarlyContent>
          <ClinicTitle>{clinic?.name}</ClinicTitle>
        </EarlyContent>

        <LatterContent>
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              open ? handleClose() : handleClick(e)
            }
          >
            {permissions.includes('USER_TYPE_PROFESSIONAL') ? (
              <FaUserMd style={{ fontSize: 35, color: '#FFF' }} />
            ) : permissions.includes('USER_TYPE_EMPLOYEE') ? (
              <FaUserTie style={{ fontSize: 35, color: '#FFF' }} />
            ) : permissions.includes('USER_TYPE_OWNER') ? (
              <FaUserCog style={{ fontSize: 40, color: '#FFF' }} />
            ) : (
              <AiOutlineUser style={{ fontSize: 40, color: '#FFF' }} />
            )}
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
            <MenuItem onClick={() => navigate('/profile/change-password')}>
              Alterar Senha
            </MenuItem>
            <hr />
            <MenuItem onClick={signOut}>Sair</MenuItem>
          </Menu>
        </LatterContent>
      </Container>
    </div>
  );
};

export default AlterTopToolbar;
