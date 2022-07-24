import { Typography } from '@mui/material';
import React from 'react';
import AlterTopToolbar from './components/AlterTopToolbar';

const App = (): JSX.Element => {
  return (
    <div style={{ width: '100%' }}>
      <AlterTopToolbar />
      <div>
        <Typography variant="h1" fontSize="5rem">
          PSIS
        </Typography>
      </div>
    </div>
  );
};

export default App;
