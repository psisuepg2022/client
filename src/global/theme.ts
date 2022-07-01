import { createTheme } from '@mui/material';
import { ptBR } from '@mui/material/locale';
import { colors } from './colors';

export const theme = createTheme(
  {
    palette: {
      primary: {
        main: colors.PRIMARY,
      },
      secondary: {
        main: colors.SECONDARY,
      },
      error: {
        main: colors.DANGER,
      },
      warning: {
        main: colors.WARNING,
      },
    },
    typography: {
      fontFamily: 'Poppins',
      fontWeightBold: '700',
      fontWeightLight: '200',
      fontWeightMedium: '500',
      fontWeightRegular: '400',
      htmlFontSize: 16,
      allVariants: {
        color: colors.TEXT,
      },
    },
  },
  ptBR
);
