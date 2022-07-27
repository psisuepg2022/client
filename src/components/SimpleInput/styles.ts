import { outlinedInputClasses, styled, TextField } from '@mui/material';
import { colors } from '../../global/colors';

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
