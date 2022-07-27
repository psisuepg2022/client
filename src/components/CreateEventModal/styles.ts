import { Box, Modal, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const StyledModal = styled(Modal)`
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledBox = styled(Box)`
  width: 40%;
  height: 40%;
  background-color: #fff;
  outline: none;
  border-radius: 5px;
  padding: 1rem;
`;

export const Header = styled('div')`
  display: flex;
  justify-content: space-between;
`;

export const Body = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

export const SlotDataText = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem 0;
`;
