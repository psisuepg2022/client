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
  StyledButton,
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
              <ControlledInput
                autoComplete="username"
                name="username"
                label="Usuário"
                required
              />
            </CodeAndUser>

            <PasswordBox>
              <ControlledInput
                type="password"
                name="password"
                label="Senha"
                required
                autoComplete="current-password"
              />
            </PasswordBox>

            <StyledButton>ENTRAR</StyledButton>
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
