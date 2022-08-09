import { colors } from '@global/colors';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const Container = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 100px;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

export const LogoAndMain = styled('div')`
  display: flex;
  gap: 40px;
`;

export const LogoContainer = styled('img')`
  height: 192px;
  width: auto;
`;

export const MainTextContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const MainTitle = styled(Typography)`
  color: ${colors.PRIMARY};
  font-weight: 600;
  font-size: 5rem;
`;

export const MainText = styled(Typography)`
  color: ${colors.PRIMARY};
  font-weight: 600;
  font-size: 3rem;
`;

export const SecondarySection = styled('div')`
  display: flex;
  flex-direction: column;
  max-width: 35%;
`;

export const SecondaryText = styled(Typography)`
  color: ${colors.PRIMARY};
  font-weight: 400;
  font-size: 1.8rem;
  text-align: center;
`;

export const StyledButton = styled(Button)`
  background-color: ${colors.PRIMARY};
  color: #fff;
  transition: 300ms;
  width: 100%;
  font-weight: 400;
  font-size: 1rem;
  height: 50px;
  margin-top: 50px;

  :hover {
    background-color: ${colors.SECONDARY};
  }
`;
