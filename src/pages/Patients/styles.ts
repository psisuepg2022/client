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
`;
