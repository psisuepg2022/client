import React from 'react';
import { Typography } from '@mui/material';
import { Container, LeftContainer, RightContainer } from './styles';

const Login = (): JSX.Element => {
  return (
    <Container>
      <LeftContainer>
        <Typography variant="h1" fontSize="5rem">
          Login
        </Typography>
      </LeftContainer>
      <RightContainer>
        <Typography variant="h1">PSIS</Typography>
      </RightContainer>
    </Container>
  );
};

export default Login;
