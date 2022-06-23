import { Button } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '../../global/colors';

export const StyledButton = styled(Button)`
  width: 100%;
  height: 50px;
  background-color: ${colors.PRIMARY};
  color: #fff;
  font-size: 1.2rem;
  font-weight: 300;

  :hover {
    background-color: ${colors.SECONDARY};
    transition: 200ms;
  }
`;
