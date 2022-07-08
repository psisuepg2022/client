import { Typography } from '@mui/material';
import { styled } from '@mui/system';

export const Container = styled('div')`
  width: 100%;
  height: 60px;
  background: linear-gradient(90deg, #419d78 0%, #009686 100%);
  display: grid;
  grid-template-columns: 6fr 1fr;
  align-items: center;
  z-index: 99; // FOR SIDEBAR BOX-SHADOW ONLY
  position: relative; // FOR SIDEBAR BOX-SHADOW ONLY
  box-shadow: 4px 2px 5px rgba(0, 0, 0, 0.48);
`;

export const EarlyContent = styled('div')`
  display: flex;
  padding-left: 3rem;
`;

export const LatterContent = styled('div')`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const ClinicTitle = styled(Typography)`
  font-size: 2rem;
  text-transform: capitalize;
  color: #fff;
`;
