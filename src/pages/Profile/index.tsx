import React from 'react';
import { Typography } from '@mui/material';
import { Box, Container, Content, Header } from './styles';
import { AiOutlineLeft } from 'react-icons/ai';
import { colors } from '../../global/colors';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledDatePicker from '../../components/ControlledDatePicker';

const Profile = (): JSX.Element => {
  const formMethods = useForm();

  return (
    <Container>
      <Box>
        <Content>
          <Header>
            <AiOutlineLeft style={{ color: colors.TEXT, fontSize: '2.5rem' }} />
            <Typography fontSize={'2.5rem'}>Perfil da Clínica</Typography>
          </Header>

          <FormProvider {...formMethods}>
            <form>
              <ControlledDatePicker
                name="birthday"
                label="Data de nascimento"
              />
            </form>
          </FormProvider>
        </Content>
      </Box>
    </Container>
  );
};

export default Profile;
