import { ButtonBase, styled, Typography } from '@mui/material';
import { colors } from '@global/colors';

export const Container = styled(ButtonBase)`
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.6rem;

  &:hover {
    background-color: ${colors.BACKGREY};
  }
`;

export const CardName = styled(Typography)`
  color: ${colors.PRIMARY};
  font-size: 1.2rem;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
