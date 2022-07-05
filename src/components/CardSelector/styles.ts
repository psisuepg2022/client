import { ButtonBase, styled, Typography } from '@mui/material';
import { colors } from '../../global/colors';

export const Container = styled(ButtonBase)`
  border-bottom: 2px ${colors.PRIMARY} solid;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.8rem;
`;

export const CardName = styled(Typography)`
  color: ${colors.PRIMARY};
  font-size: 1.2rem;
  text-transform: uppercase;
`;
