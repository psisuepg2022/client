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
  width: 30%;
  height: auto;
  background-color: #fff;
  outline: none;
  border-radius: 5px;
  padding: 1rem;

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
  height: 100%;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
`;

export const ButtonArea = styled('div')`
  padding-top: 3rem;
`;

export const SlotDataText = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem 0;
`;

export const StyledButton = styled(Button)`
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

export const ConditionalInputs = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const TimePickerContainer = styled('form')`
  display: flex;
  gap: 10px;
`;
