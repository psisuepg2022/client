import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '@global/colors';

export const Container = styled('div')`
  background-color: ${colors.BACKGREY};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
`;

export const Content = styled('div')`
  height: calc(100vh - 60px);
  background-color: ${colors.BACKGREY};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CustomBox = styled('div')`
  background-color: #fff;
  height: 90%;
  width: 90%;
  border-radius: 5px;
  border: 1px rgba(0, 0, 0, 0.2) solid;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 2rem;
`;

export const BoxHeader = styled('div')`
  display: flex;
  align-items: center;
  gap: 15px;
  /* display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 0 0 2rem 0; */
`;

export const CommentsTitle = styled(Typography)`
  font-size: 1.8rem;
  color: ${colors.TEXT};
  font-weight: 600;
`;

export const PatientName = styled(Typography)`
  font-size: 1.8rem;
  color: ${colors.TEXT};
  font-weight: 400;
`;

export const AppointmentDate = styled(Typography)`
  font-size: 1.5rem;
  color: ${colors.TEXT};
  font-weight: 400;
`;

export const LogoContainer = styled('img')`
  width: 100px;
  height: auto;
`;
