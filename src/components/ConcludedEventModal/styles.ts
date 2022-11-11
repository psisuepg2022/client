import { Box, Button, Modal, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '@global/colors';

export const StyledModal = styled(Modal)`
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledBox = styled(Box)`
  width: 25%;
  height: auto;
  background-color: #fff;
  outline: none;
  border-radius: 5px;
  padding: 1rem;

  @media (max-width: 1700px) {
    width: 30%;
  }
  @media (max-width: 1500px) {
    width: 40%;
  }
  @media (max-width: 1060px) {
    width: 55%;
  }
  @media (max-width: 880px) {
    width: 65%;
  }
`;

export const Header = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Body = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 1rem;
`;

export const StatusText = styled(Typography)`
  color: ${colors.TEXT};
  font-size: 1.2rem;

  & span {
    color: ${colors.PRIMARY};
    font-weight: 600;
  }
`;

export const EventPrimaryText = styled(Typography)`
  font-size: 1.5rem;
  color: ${colors.TEXT};
  font-weight: 600;
`;

export const AdditionalInfos = styled('div')`
  display: flex;
  align-items: center;
  gap: 4rem;
`;

export const ScheduledAtContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const ScheduleAtText = styled('div')`
  color: ${colors.TEXT};
`;

export const ScheduleAtDate = styled('div')`
  font-weight: 500;
`;

export const ContactNumberText = styled(Typography)`
  font-size: 1.1rem;
  color: ${colors.TEXT};
  font-weight: 400;

  span {
    font-weight: 500;
  }
`;

export const ButtonsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 80%;
  gap: 1rem;
  padding-bottom: 20px;
`;

export const StyledConfirmButton = styled(Button)`
  background-color: ${colors.PRIMARY};
  color: #fff;
  transition: 300ms;
  width: 100%;
  font-weight: 400;
  font-size: 1rem;
  height: 50px;

  :hover {
    background-color: ${colors.SECONDARY};
  }
`;
