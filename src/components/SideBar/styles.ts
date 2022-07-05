import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import { NavLink } from 'react-router-dom';
import { colors } from '../../global/colors';

export const Container = styled('div')`
  width: 250px;
  height: 100vh;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  transition: 850ms;
  background: linear-gradient(180deg, #419d78 22.4%, #009686 100%);
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.48);
`;

export const CollapsedContainer = styled('div')`
  width: 70px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  transition: 850ms;
  background: linear-gradient(180deg, #419d78 22.4%, #009686 100%);
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.48);
`;

export const Header = styled('div')`
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1rem;
`;

export const CollapsedHeader = styled('div')`
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
`;

export const Content = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const NavItem = styled(NavLink)`
  transition: 300ms;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  text-decoration: none;

  :hover {
    background-color: ${colors.SECONDARY};
  }
`;

export const CollapsedNavItem = styled(NavLink)`
  transition: 300ms;
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  :hover {
    background-color: ${colors.SECONDARY};
  }
`;

export const NavItemTitle = styled(Typography)`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 400;
  padding-left: 2rem;
`;
