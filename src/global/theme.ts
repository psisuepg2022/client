import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#419D78',
    },
    secondary: {
      main: '#009686',
    },
  },
  typography: {
    fontFamily: 'Poppins',
    fontWeightBold: '700',
    fontWeightLight: '200',
    fontWeightMedium: '500',
    fontWeightRegular: '400',
    htmlFontSize: 16,
  },
});
