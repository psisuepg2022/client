import React from 'react';
import { ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';
import App from './App';
import { theme } from './global/theme';
import './main.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
