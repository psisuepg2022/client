import { Button, MenuItem, menuItemClasses, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '../../global/colors';
import { outlinedInputClasses, TextField } from '@mui/material';

export const Container = styled('div')`
  background-color: ${colors.BACKGREY};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

export const Content = styled('div')`
  min-height: 90%;
  background-color: ${colors.BACKGREY};
  display: flex;
  justify-content: center;
  overflow: scroll;
  align-items: center;
  padding-top: 1rem;
`;

export const CustomBox = styled('div')`
  background-color: #fff;
  min-height: 90%;
  height: auto;
  width: 90%;
  border-radius: 5px;
  border: 1px rgba(0, 0, 0, 0.2) solid;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  justify-content: space-between;
`;

export const BoxHeader = styled('div')`
  display: flex;
  padding: 0 0 1rem 0;
`;

export const PageTitle = styled(Typography)`
  font-size: 2rem;
  color: ${colors.TEXT};
  font-weight: 600;
`;

export const StyledForm = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const PersonalDataFirst = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
`;

export const PersonalDataSecond = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 1rem;
`;

export const AuxDataFirst = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  column-gap: 1rem;
`;

export const AuxDataSecond = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  column-gap: 1rem;
`;

export const StyledButton = styled(Button)`
  background-color: ${colors.PRIMARY};
  color: #fff;
  transition: 300ms;
  width: 100%;
  font-weight: 400;
  font-size: 1rem;
  height: 50px;

  :hover {
    background-color: ${colors.SECONDARY};
  }
`;

export const StyledButtonInverted = styled(Button)`
  background-color: #fff;
  color: ${colors.PRIMARY};
  transition: 300ms;
  width: 100%;
  font-weight: 400;
  font-size: 1rem;
  height: 50px;
  border: 1px solid ${colors.PRIMARY};

  :hover {
    background-color: ${colors.BACKGREY};
  }
`;

export const ButtonsContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 1rem;
  padding: 2rem 0 0 0;
`;

export const StyledMenuItem = styled(MenuItem)`
  transition: 300ms;

  &.${menuItemClasses.selected} {
    background-color: #d0d0d0;
  }
`;

export const CustomTextField = styled(TextField)`
  & .${outlinedInputClasses.notchedOutline} {
    border-color: ${colors.PRIMARY};
  }
  &:hover .${outlinedInputClasses.notchedOutline} {
    border-color: ${colors.SECONDARY} !important;
    border-width: 2px;
  }

  &.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline} {
    border-color: ${colors.SECONDARY};
  }
  &.${outlinedInputClasses.inputAdornedEnd}
    .${outlinedInputClasses.notchedOutline} {
    color: ${colors.SECONDARY};
  }
  &.${outlinedInputClasses.notchedOutline} .${outlinedInputClasses.input} {
    color: ${colors.SECONDARY};
  }
`;
