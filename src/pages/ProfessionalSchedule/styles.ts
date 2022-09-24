import { Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '@global/colors';

export const Container = styled('div')`
  background-color: ${colors.PRIMARY};
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Box = styled('div')`
  width: 90%;
  height: 90%;
  border-radius: 5px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled('div')`
  width: 90%;
  height: 90%;
  position: relative;
`;

export const Header = styled('div')`
  height: 10%;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const LogoContainer = styled('img')`
  width: 100px;
  height: auto;
`;

export const DayHoursAndLocks = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const TimesLabel = styled(Typography)`
  color: ${colors.TEXT};
  font-weight: 600;
  font-size: 1rem;
  padding: 2rem 0 1rem 0;
`;

export const WorkHoursContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 1rem;
  width: 60%;
`;

export const IntervalsContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 1rem;
  width: 60%;
`;
