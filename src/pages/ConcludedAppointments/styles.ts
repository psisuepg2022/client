import { Button, Typography } from '@mui/material';
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
  overflow-y: scroll;
`;

export const BoxHeader = styled('div')`
  /* display: flex;
  align-items: center;
  gap: 15px; */
  padding-bottom: 20px;
  display: grid;
  width: 100%;
  align-self: center;
  grid-template-columns: 1.6fr 1.4fr 1fr;
  gap: 1rem;
  align-items: center;

  @media (max-width: 1700px) {
    grid-template-columns: 1.8fr 1.2fr 1fr;
  }
  @media (max-width: 1515px) {
    grid-template-columns: 2fr 1.2fr 0.8fr;
  }
`;

export const CommentsTitle = styled(Typography)`
  font-size: 1.5rem;
  color: ${colors.TEXT};
  font-weight: 600;
  transition: 300ms;

  @media (max-width: 1385px) {
    font-size: 1.3rem;
  }
`;

export const PatientName = styled(Typography)`
  font-size: 1.4rem;
  color: ${colors.TEXT};
  font-weight: 400;
  transition: 300ms;
  @media (max-width: 1385px) {
    font-size: 1.2rem;
  }
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

export const CommentBox = styled('div')`
  border-radius: 5px;
  border: 1px solid ${colors.PRIMARY};
  height: 50px;
  width: 100%;
  display: grid;
  grid-template-columns: 1.4fr 1.2fr 0.8fr 0.6fr;
  align-items: center;
`;

export const ScheduleStatus = styled(Typography)`
  font-size: 1rem;
  color: ${colors.TEXT};
  padding: 0 1rem;

  span {
    font-weight: 600;
  }
`;

export const InputsForm = styled('form')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const ButtonsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StyledButton = styled(Button)`
  background-color: ${colors.PRIMARY};
  color: #fff;
  transition: 300ms;
  width: 100%;
  font-weight: 400;
  font-size: 1rem;
  height: 56px;

  :hover {
    background-color: ${colors.SECONDARY};
  }
`;
