import { styled, Typography } from '@mui/material';
import { colors } from '@global/colors';

export const CustomDateHeaderContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 15px;
  height: 100%;
  position: relative;
`;

export const CustomDateHeaderContent = styled('div')`
  // background-color: ${colors.PRIMARY};
  border-radius: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const CustomDateHeaderText = styled(Typography)`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${colors.PRIMARY};
`;

export const CustomDateHeaderLink = styled('a')`
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  position: absolute;
  right: 0px;
  top: 15px;
  color: ${colors.TEXT};
`;

export const CustomHeaderMonthText = styled(Typography)`
  font-size: 1rem;
  font-weight: 600;
  padding: 5px 0;
`;

export const LogoContainer = styled('img')`
  width: 100px;
  height: auto;
`;

export const DisableDayContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  justify-content: center;
  height: 100%;
`;

export const DisableDayContent = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;
