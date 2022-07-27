import React from 'react';
import AlterTopToolbar from '../../components/AlterTopToolbar';
import { Container, Content, CustomBox } from './styles';

const PatientsForm = (): JSX.Element => {
  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox></CustomBox>
      </Content>
    </Container>
  );
};

export default PatientsForm;
