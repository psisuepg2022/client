import {
  Button,
  InputLabel,
  inputLabelClasses,
  MenuItem,
  menuItemClasses,
  TableCell,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '@global/colors';

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
  padding: 2rem;
`;

export const BoxHeader = styled('div')`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 0 0 2rem 0;
`;

export const PageTitle = styled(Typography)`
  font-size: 2rem;
  color: ${colors.TEXT};
  font-weight: 600;
`;

export const TitleAndInputs = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const InputsForm = styled('form')`
  display: grid;
  grid-template-columns: 20fr 1fr;
  gap: 1rem;
`;

export const ButtonsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StyledButton = styled(Button)`
  background-color: ${colors.PRIMARY};
  color: #fff;
  transition: 300ms;
  width: 100%;
  font-weight: 400;
  font-size: 1rem;
  height: 56px;

  :hover {
    background-color: ${colors.SECONDARY};
  }
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

export const LogoContainer = styled('img')`
  width: 100px;
  height: auto;
`;

export const StyledInputLabel = styled(InputLabel)`
  color: ${colors.PRIMARY};

  &.${inputLabelClasses.focused} {
    // MUITO IMPORTANTE NÃO DEIXAR ESPAÇO ENTRE O '&' E O '.'
    color: ${colors.PRIMARY} !important;
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  transition: 300ms;

  &.${menuItemClasses.selected} {
    background-color: #d0d0d0;
  }
`;

export const StyledTableCell = styled(TableCell)`
  padding: 6px;
`;

export const NoRowsContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const NoRowsText = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 600;
`;
