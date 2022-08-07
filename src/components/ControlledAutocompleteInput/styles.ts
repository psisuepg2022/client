import {
  InputLabel,
  inputLabelClasses,
  outlinedInputClasses,
  TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '@global/colors';

export const StyledTextfield = styled(TextField)`
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

export const StyledInputLabel = styled(InputLabel)`
  color: ${colors.PRIMARY};

  &.${inputLabelClasses.focused} {
    // MUITO IMPORTANTE NÃO DEIXAR ESPAÇO ENTRE O '&' E O '.'
    color: ${colors.PRIMARY} !important;
  }
`;
