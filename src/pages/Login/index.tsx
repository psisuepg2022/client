import React from 'react';
import {
  CodeAndUser,
  Container,
  ImageLogo,
  InputsContainer,
  IntroText,
  IntroTextBold,
  LeftContainer,
  LogoAndTitle,
  PasswordBox,
  RightContainer,
  SubTitleRegular,
  TitleAndSubTitle,
  TitleExtense,
  TitleThin,
} from './styles';

import LogoPSIS from '../../assets/PSIS-Logo-Transparente.png';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledInput from '../../components/ControlledInput';

const Login = (): JSX.Element => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  return (
    <Container>
      <LeftContainer>
        <TitleAndSubTitle>
          <TitleThin>PSIS</TitleThin>
          <SubTitleRegular>Acesse o painel da sua clínica</SubTitleRegular>
        </TitleAndSubTitle>

        <FormProvider {...formMethods}>
          <InputsContainer>
            <CodeAndUser>
              <ControlledInput name="code" label="Código" required />
              <ControlledInput name="username" label="Usuário" required />
            </CodeAndUser>

            <PasswordBox>
              <ControlledInput
                type="password"
                name="password"
                label="Senha"
                required
              />
            </PasswordBox>
          </InputsContainer>
        </FormProvider>
      </LeftContainer>
      <RightContainer>
        <LogoAndTitle>
          <ImageLogo src={LogoPSIS} />
          <TitleExtense>Patient And Scheduling Information System</TitleExtense>
        </LogoAndTitle>

        <IntroText>
          Aumente a <IntroTextBold>produtividade</IntroTextBold> da sua clínica
          através do agendamento <IntroTextBold>online</IntroTextBold>.
          <br />
          <IntroTextBold>Rastreabilidade</IntroTextBold> completa de
          funcionários e pacientes.
        </IntroText>
      </RightContainer>
    </Container>
  );
};

export default Login;
