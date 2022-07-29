/* eslint-disable quotes */
import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { ClinicTitle, Container, EarlyContent, LatterContent } from './styles';
import { AiOutlineUser } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const AlterTopToolbar = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

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
          <ClinicTitle>KLINIK</ClinicTitle>
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
            <MenuItem>Logout</MenuItem>
          </Menu>
        </LatterContent>
      </Container>
    </div>
  );
};

export default AlterTopToolbar;
