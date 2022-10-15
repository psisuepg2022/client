import { colors } from '@global/colors';
import { Box, Modal, styled, Typography } from '@mui/material';

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
  gap: 1rem;
  padding: 1rem 1rem;
`;

export const StatusText = styled(Typography)`
  color: ${colors.TEXT};
  font-size: 1.2rem;
  font-weight: 700;
`;

export const StatusSectionText = styled(Typography)`
  color: ${colors.TEXT};
  font-size: 1.1rem;
  font-weight: 600;
`;

export const ColorRow = styled('div')`
  width: 90%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  justify-content: space-around;
`;

export const ColorBox = styled('div')(({ color }) => ({
  width: 30,
  height: 30,
  backgroundColor: color,
  border: '1px solid #707070',
}));

export const ColorText = styled(Typography)`
  font-size: 1rem;
  font-weight: 500;
`;
