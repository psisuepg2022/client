import React from 'react';
import { Typography } from '@mui/material';
import { Box, Container, Content, Header } from './styles';
import { AiOutlineLeft } from 'react-icons/ai';
import { colors } from '../../global/colors';

const Profile = (): JSX.Element => {
  return (
    <Container>
      <Box>
        <Content>
          <Header>
            <AiOutlineLeft style={{ color: colors.TEXT, fontSize: '2.5rem' }} />
            <Typography fontSize={'2.5rem'}>Perfil da Clínica</Typography>
          </Header>
        </Content>
      </Box>
    </Container>
  );
};

export default Profile;
