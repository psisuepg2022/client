import React, { useState } from 'react';
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

import logoPSIS from '@assets/PSIS-Logo-Transparente.png';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import ControlledInput from '@components/ControlledInput';
import { useAuth } from '@contexts/Auth';
import { showAlert } from '@utils/showAlert';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type FormProps = {
  accessCode: number;
  userName: string;
  password: string;
};

const Login = (): JSX.Element => {
  const { signIn } = useAuth();
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const formData: FormProps = data as FormProps;

    try {
      setLoading(true);
      await signIn(formData);
      navigate('/schedule', { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        text: e?.response?.data?.message || 'Ocorreu um problema inesperado',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
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
                    message: 'O código é obrigatório',
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
                endFunction="password"
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
              {loading ? (
                <CircularProgress style={{ color: '#FFF' }} size={20} />
              ) : (
                'ENTRAR'
              )}
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
