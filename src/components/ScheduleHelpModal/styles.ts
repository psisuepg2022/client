import { Box, Modal, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '@global/colors';

export const StyledModal = styled(Modal)`
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledBox = styled(Box)`
  width: 55%;
  height: auto;
  background-color: #fff;
  outline: none;
  border-radius: 5px;
  padding: 1rem;

  @media (max-width: 1700px) {
    width: 40%;
  }
  @media (max-width: 1500px) {
    width: 50%;
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
  height: 100%;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1rem;
  max-height: 80vh;
  overflow-y: scroll;
`;

export const StatusText = styled(Typography)`
  color: ${colors.TEXT};
  font-size: 1rem;

  text-align: justify;

  & span {
    color: ${colors.PRIMARY};
    font-weight: 600;
  }
`;

export const EventPrimaryText = styled(Typography)`
  font-size: 1.3rem;
  text-align: justify;
  color: ${colors.TEXT};
  font-weight: 600;
`;

export const ScheduleAtText = styled('div')`
  color: ${colors.TEXT};
  text-align: justify;
  font-size: 1rem;
`;
