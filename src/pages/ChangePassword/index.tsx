import React, { useEffect, useState } from 'react';
import { CircularProgress, IconButton, Typography } from '@mui/material';
import {
  Box,
  Container,
  Content,
  Form,
  Header,
  PersonalInfo,
  StyledButton,
} from './styles';
import { FiChevronLeft } from 'react-icons/fi';
import { colors } from '@global/colors';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import ControlledInput from '@components/ControlledInput';
import SectionDivider from '@components/SectionDivider';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '@utils/showAlert';
import { useAuth } from '@contexts/Auth';

type ProfileFormProps = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePassword = (): JSX.Element => {
  const { changePassword } = useAuth();
  const formMethods = useForm<ProfileFormProps>();
  const { handleSubmit } = formMethods;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        showAlert({
          icon: 'error',
          text:
            e?.response?.data?.message ||
            'Ocorreu um problema ao carregar seu perfil de usuário',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const formData: ProfileFormProps = data as ProfileFormProps;
    const { confirmNewPassword, newPassword, oldPassword } = formData;

    try {
      setLoading(true);

      const { message } = await changePassword(
        oldPassword,
        newPassword,
        confirmNewPassword
      );
      showAlert({
        title: 'Sucesso!',
        icon: 'success',
        text: message,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao alterar a senha',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box>
        <Content>
          <Header>
            <IconButton onClick={() => navigate(-1)}>
              <FiChevronLeft
                style={{ color: colors.TEXT, fontSize: '2.5rem' }}
              />
            </IconButton>
            <Typography fontSize={'2.5rem'}>Alterar Senha</Typography>
          </Header>

          <div
            style={{
              paddingLeft: 20,
            }}
          >
            <SectionDivider>Escolha uma nova senha</SectionDivider>
          </div>
          <FormProvider {...formMethods}>
            <Form id="form" onSubmit={handleSubmit(onSubmit)}>
              <PersonalInfo>
                <ControlledInput
                  name="oldPassword"
                  type="password"
                  endFunction="password"
                  label="Senha atual"
                  rules={{
                    required: {
                      value: true,
                      message: 'A senha atual é necessária',
                    },
                  }}
                />
                <ControlledInput
                  name="newPassword"
                  type="password"
                  endFunction="password"
                  label="Nova senha"
                  rules={{
                    required: {
                      value: true,
                      message: 'A nova senha é obrigatória',
                    },
                  }}
                />
                <ControlledInput
                  name="confirmNewPassword"
                  type="password"
                  endFunction="password"
                  label="Confirme a nova senha"
                  rules={{
                    required: {
                      value: true,
                      message: 'A confirmação da nova senha é obrigatória',
                    },
                  }}
                />
                <StyledButton type="submit" form="form">
                  {loading ? (
                    <CircularProgress size={20} style={{ color: '#FFF' }} />
                  ) : (
                    'SALVAR'
                  )}
                </StyledButton>
              </PersonalInfo>
            </Form>
          </FormProvider>
        </Content>
      </Box>
    </Container>
  );
};

export default ChangePassword;
