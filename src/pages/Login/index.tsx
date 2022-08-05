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

import logoPSIS from '../../assets/PSIS-Logo-Transparente.png';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import ControlledInput from '../../components/ControlledInput';

type FormProps = {
  accessCode: number;
  userName: string;
  password: string;
};

const Login = (): JSX.Element => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  const onSubmit = (data: FieldValues): void => {
    const formData: FormProps = data as FormProps;
    console.log('DATA', formData);
  };

  return (
    <Container>
      <LeftContainer>
        <TitleAndSubTitle>
          <TitleThin>PSIS</TitleThin>
          <SubTitleRegular>Acesse o painel da sua clínica</SubTitleRegular>
        </TitleAndSubTitle>

        <FormProvider {...formMethods}>
          <InputsContainer id="form" onSubmit={handleSubmit(onSubmit)}>
            <CodeAndUser>
              <ControlledInput
                name="accessCode"
                label="Código"
                rules={{
                  required: {
                    value: true,
                    message: 'O código de acesso é obrigatório',
                  },
                }}
              />
              <ControlledInput
                name="userName"
                label="Usuário"
                rules={{
                  required: {
                    value: true,
                    message: 'O nome de usuário é obrigatório',
                  },
                }}
              />
            </CodeAndUser>

            <PasswordBox>
              <ControlledInput
                type="password"
                name="password"
                label="Senha"
                rules={{
                  required: {
                    value: true,
                    message: 'A senha é obrigatória',
                  },
                }}
              />
            </PasswordBox>

            <StyledButton type="submit" form="form">
              ENTRAR
            </StyledButton>
          </InputsContainer>
        </FormProvider>
      </LeftContainer>
      <RightContainer>
        <LogoAndTitle>
          <ImageLogo src={logoPSIS} />
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
