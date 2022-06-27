import {
  InputLabel,
  Select,
  inputLabelClasses,
  selectClasses,
  outlinedInputClasses,
} from '@mui/material';
import { styled } from '@mui/system';

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
