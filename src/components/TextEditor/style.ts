import { colors } from '@global/colors';
import { Button, styled } from '@mui/material';

export const Container = styled('div')`
  width: 100%;
  height: 100%;
`;

export const Content = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const StyledButton = styled(Button)`
  background-color: ${colors.PRIMARY};
  color: #fff;
  transition: 300ms;
  width: 350px;
  font-weight: 400;
  font-size: 1rem;
  height: 50px;
  align-self: flex-end;
  margin-top: 20px;

  :hover {
    background-color: ${colors.SECONDARY};
  }
`;
