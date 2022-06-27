import {
  MenuItem,
  Select,
  outlinedInputClasses,
  Button,
  Typography,
  selectClasses,
} from '@mui/material';
import { styled } from '@mui/system';

export const Container = styled('div')`
  width: 100%;
  height: 60px;
  background: linear-gradient(90deg, #419d78 0%, #009686 100%);
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
`;

export const EarlyContent = styled('div')`
  display: flex;
  padding-left: 3rem;
`;

export const MiddleContent = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DayTitle = styled(Typography)`
  font-size: 1.5rem;
  color: #fff;
  padding: 0 1rem;
`;

export const LatterContent = styled('div')`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const StyledSelect = styled(Select)`
  color: #fff;
  width: 150px;
  height: 40px;
  padding-top: 0;
  padding-bottom: 0;
  border-color: #fff;

  & .${outlinedInputClasses.notchedOutline} {
    border-color: #fff;
  }
  &:hover .${outlinedInputClasses.notchedOutline} {
    border-color: #fff;
  }
  & .${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline} {
    border-color: #fff;
  }
  &:focus .${selectClasses.outlined} {
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  transition: 300ms;
`;

export const TodayButton = styled(Button)`
  background: transparent;
  border-color: #fff;
  color: #fff;
  height: 40px;

  :hover {
    border-color: #fff;
  }
`;

export const ClinicTitle = styled(Typography)`
  font-size: 2rem;
  text-transform: capitalize;
  color: #fff;
`;
