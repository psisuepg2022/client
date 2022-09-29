import { MenuItem, Button, Typography, menuItemClasses } from '@mui/material';
import { styled } from '@mui/system';
import {
  InputLabel,
  Select,
  inputLabelClasses,
  selectClasses,
  outlinedInputClasses,
} from '@mui/material';

export const Container = styled('div')`
  width: 100%;
  height: 60px;
  background: linear-gradient(90deg, #419d78 0%, #009686 100%);
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  z-index: 99; // FOR SIDEBAR BOX-SHADOW ONLY
  position: relative; // FOR SIDEBAR BOX-SHADOW ONLY
  box-shadow: 4px 2px 5px rgba(0, 0, 0, 0.48);
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

  @media (max-width: 1080px) {
    font-size: 1.2rem;
  }
  @media (max-width: 990px) {
    font-size: 1rem;
  }
`;

export const LatterContent = styled('div')`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const StyledMenuItem = styled(MenuItem)`
  transition: 300ms;

  &.${menuItemClasses.selected} {
    background-color: #d0d0d0;
  }
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
  font-size: 1.6rem;
  text-transform: capitalize;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const StyledSelect = styled(Select)`
  width: 150px;
  height: 40px;
  color: #fff;
  border-color: #fff;

  & .${selectClasses.icon} {
    color: #fff;
  }

  & .${outlinedInputClasses.notchedOutline} {
    border-color: #fff;
  }
  &:hover .${outlinedInputClasses.notchedOutline} {
    border-color: #fff;
  }

  &.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline} {
    // MUITO IMPORTANTE NÃO DEIXAR ESPAÇO ENTRE O '&' E O '.'
    border-color: #fff !important;
  }
`;

export const StyledInputLabel = styled(InputLabel)`
  color: #fff;

  &.${inputLabelClasses.focused} {
    // MUITO IMPORTANTE NÃO DEIXAR ESPAÇO ENTRE O '&' E O '.'
    color: #fff !important;
  }
`;
