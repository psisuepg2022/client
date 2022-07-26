import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '../../global/colors';

export const Container = styled('div')`
  background-color: ${colors.BACKGREY};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
`;

export const Content = styled('div')`
  height: calc(100vh - 60px);
  background-color: ${colors.BACKGREY};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CustomBox = styled('div')`
  background-color: #fff;
  height: 90%;
  width: 90%;
  border-radius: 5px;
  border: 1px rgba(0, 0, 0, 0.2) solid;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
`;

export const BoxHeader = styled('div')`
  display: flex;
  flex-grow: 1;
`;

export const PageTitle = styled(Typography)`
  font-size: 2rem;
  color: ${colors.TEXT};
  font-weight: 600;
`;

export const PersonalDataExpand = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1rem 0;
`;

export const AuxDataExpand = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1rem 0;
`;

export const TextExpand = styled(Typography)`
  font-size: 1rem;

  span {
    font-weight: 600;
  }
`;