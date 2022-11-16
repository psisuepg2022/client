import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import { NavLink } from 'react-router-dom';
import { colors } from '@global/colors';

export const Container = styled('div')`
  width: 250px;
  min-height: 100vh;
  max-width: 250px;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;
  margin-bottom: -101%;
  padding-bottom: 101%;
  left: 0;
  transition: 850ms;
  background: linear-gradient(180deg, #419d78 22.4%, #009686 100%);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
`;

export const CollapsedContainer = styled('div')`
  width: 70px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  transition: 850ms;
  background: linear-gradient(180deg, #419d78 22.4%, #009686 100%);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
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
  justify-content: space-between;
  height: 100%;
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

export const UserNameContainer = styled('div')`
  display: flex;
  text-align: center;
`;

export const UserName = styled(Typography)`
  color: #fff;
  font-size: 1rem;
  font-weight: 400;
  padding: 1rem 0;
  border-bottom: 1px solid #fff;
  margin: 0 1rem;
  margin-bottom: 1rem;

  span {
    font-weight: 600;
  }
`;

export const HolidayContianer = styled('div')`
  display: grid;
  grid-template-columns: 4fr 1fr 8fr;
  padding: 0 1rem;
`;

export const HolidayText = styled(Typography)`
  font-size: 0.9rem;
  font-weight: 400;
  color: #fff;

  span {
    font-weight: 600;
  }
`;

export const IconButtonArea = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  cursor: pointer;
  vertical-align: middle;
  text-align: center;
  padding: 8px;
  border-radius: 50%;
  color: rgba(0, 0, 0, 0.54);
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
