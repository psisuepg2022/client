import { styled, Typography } from '@mui/material';
import { colors } from '@global/colors';

export const SectionTitle = styled(Typography)`
  font-size: 1rem;
  color: ${colors.PRIMARY};
`;

export const SectionBar = styled('hr')`
  flex-grow: 1;
  height: 1px;
  background-color: ${colors.PRIMARY};
  border: none;
  margin-left: 10px;
`;

export const SectionHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
