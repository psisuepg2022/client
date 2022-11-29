import React, { useState, useEffect } from 'react';
import {
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
import ControlledSelect from '@components/ControlledSelect';
import { StyledMenuItem } from '@pages/Patients/styles';
import { Clinic } from '@models/Clinic';

type FormProps = {
  clinic: string;
  userName: string;
  password: string;
  accessCode?: string;
};

const Login = (): JSX.Element => {
  const { signIn, getClinics } = useAuth();
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { content } = await getClinics();
        setClinics(content?.items || []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        showAlert({
          text:
            e?.response?.data?.message ||
            'Ocorreu um problema ao recuperar as clínicas',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const formData: FormProps = data as FormProps;
    const { clinic, accessCode, ...toSend } = formData;

    try {
      setLoading(true);
      const user = await signIn({
        ...toSend,
        accessCode:
          clinic === '' ? (Number(accessCode) as number) : Number(clinic),
      });

      if (user.permissions.includes('USER_TYPE_PROFESSIONAL_UNCONFIGURED')) {
        navigate('/professional-config', { replace: true });
      } else {
        navigate('/schedule', { replace: true });
      }
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
        </TitleAndSubTitle>

        <FormProvider {...formMethods}>
          <InputsContainer
            id="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="new-password"
          >
            <SubTitleRegular>Acesse o painel da sua clínica</SubTitleRegular>
            <PasswordBox>
              {!loading && clinics.length === 0 ? (
                <ControlledInput
                  name="accessCode"
                  label="Código"
                  disabled={loading}
                  mask={(value: string) => value.replace(/\D/g, '')}
                  rules={{
                    required: {
                      value: true,
                      message: 'O código é obrigatório',
                    },
                  }}
                />
              ) : (
                <ControlledSelect
                  defaultValue={''}
                  disabled={loading}
                  name="clinic"
                  label="Clínica"
                  required
                  rules={{
                    required: {
                      value: true,
                      message: 'É obrigatório selecionar uma clínica',
                    },
                  }}
                >
                  {!loading && clinics
                    ? clinics.map((clinic) => (
                        <StyledMenuItem key={clinic.code} value={clinic.code}>
                          {`${clinic.name}`}
                        </StyledMenuItem>
                      ))
                    : null}
                </ControlledSelect>
              )}
              <ControlledInput
                name="userName"
                label="Usuário"
                disabled={loading}
                required
                rules={{
                  required: {
                    value: true,
                    message: 'O nome de usuário é obrigatório',
                  },
                }}
              />
              <ControlledInput
                type="password"
                disabled={loading}
                endFunction="password"
                name="password"
                label="Senha"
                required
                rules={{
                  required: {
                    value: true,
                    message: 'A senha é obrigatória',
                  },
                }}
              />
            </PasswordBox>

            <StyledButton disabled={loading} type="submit" form="form">
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
