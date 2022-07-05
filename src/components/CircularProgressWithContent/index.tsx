import { Box, CircularProgress } from '@mui/material';
import React from 'react';

type CircularProps = {
  content: React.ReactElement;
  size: number;
  thickness?: number;
};

const CircularProgressWithContent = ({
  content,
  size,
}: CircularProps): JSX.Element => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress size={size} thickness={1} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {content}
      </Box>
    </Box>
  );
};

export default CircularProgressWithContent;
