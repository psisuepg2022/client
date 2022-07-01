import { Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '../../global/colors';

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
  display: flex;
  align-items: center;
`;

export const Form = styled('form')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

export const PersonalInfo = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

export const PersonalInfoHalf = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

export const ButtonContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: absolute;
  bottom: 0;
  right: 0;
`;

export const StyledButton = styled(Button)`
  background-color: ${colors.PRIMARY};
  color: #fff;
  transition: 300ms;
  width: 20rem;
  font-weight: 400;
  font-size: 1rem;
  height: 50px;

  :hover {
    background-color: ${colors.SECONDARY};
  }
`;
