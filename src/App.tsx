import { Typography } from '@mui/material';
import React from 'react';
import TopToolbar from './components/TopToolbar';

const App = (): JSX.Element => {
  return (
    <div style={{ width: '100%' }}>
      <TopToolbar />
      <div>
        <Typography variant="h1" fontSize="5rem">
          PSIS
        </Typography>
      </div>
    </div>
  );
};

export default App;
