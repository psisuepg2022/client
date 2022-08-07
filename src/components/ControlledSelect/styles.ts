import {
  InputLabel,
  Select,
  inputLabelClasses,
  selectClasses,
  outlinedInputClasses,
} from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '@global/colors';

export const StyledSelect = styled(Select)`
  color: ${colors.TEXT};
  border-color: ${colors.PRIMARY};

  & .${selectClasses.icon} {
    color: ${colors.PRIMARY};
  }

  & .${outlinedInputClasses.notchedOutline} {
    border-color: ${colors.PRIMARY};
  }
  &:hover .${outlinedInputClasses.notchedOutline} {
    border-color: ${colors.PRIMARY};
  }

  &.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline} {
    // MUITO IMPORTANTE NÃO DEIXAR ESPAÇO ENTRE O '&' E O '.'
    border-color: ${colors.PRIMARY} !important;
  }
`;

export const StyledInputLabel = styled(InputLabel)`
  color: ${colors.PRIMARY};

  &.${inputLabelClasses.focused} {
    // MUITO IMPORTANTE NÃO DEIXAR ESPAÇO ENTRE O '&' E O '.'
    color: ${colors.PRIMARY} !important;
  }
`;
