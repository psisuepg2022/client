import React, { useId, useState } from 'react';
import {
  Body,
  ButtonsContainer,
  Form,
  Header,
  StatusText,
  StyledBox,
  StyledConfirmButton,
  StyledModal,
} from './styles';
import { MdOutlineClose } from 'react-icons/md';
import { colors } from '@global/colors';
import { CircularProgress, IconButton } from '@mui/material';
import { Professional } from '@models/Professional';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledInput from '@components/ControlledInput';
import { useOwner } from '@contexts/Owner';
import { showAlert } from '@utils/showAlert';
import { showToast } from '@utils/showToast';

type UpdateProfessionalPasswordModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  professional: Professional;
};

type PasswordFormProps = {
  newPassword: string;
  confirmNewPassword: string;
};

const UpdateProfessionalPasswordModal = ({
  open,
  handleClose,
  professional,
}: UpdateProfessionalPasswordModalProps): JSX.Element => {
  const formMethods = useForm<PasswordFormProps>();
  const { resetPassword } = useOwner();
  const { handleSubmit, reset } = formMethods;
  const [loading, setLoading] = useState<boolean>(false);
  const randomKey = useId();

  if (!professional) return <></>;

  if (professional && !professional.id) return <></>;

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    reset({ confirmNewPassword: '', newPassword: '' });
    handleClose(reason);
  };

  const onSubmit = async (data: PasswordFormProps): Promise<void> => {
    try {
      setLoading(true);
      const { message } = await resetPassword(
        professional.id,
        data.newPassword,
        data.confirmNewPassword
      );

      showToast({
        text: message,
      });
      closeAll('');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          `Ocorreu um problema ao atualizar a senha de ${professional.name}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledModal
      open={open}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClose={(event: any, reason: 'backdropClick' | 'escapeKeyDown') =>
        closeAll(reason)
      }
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <StyledBox>
        <Header>
          <MdOutlineClose style={{ fontSize: 35, color: 'transparent' }} />
          <StatusText>{professional.name}</StatusText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <FormProvider {...formMethods}>
            <Form
              id={`${randomKey}-password`}
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
            >
              <ControlledInput
                rules={{
                  required: {
                    value: true,
                    message: 'A nova senha é obrigatória',
                  },
                }}
                type="password"
                endFunction="password"
                name="newPassword"
                label="Nova senha"
              />
              <ControlledInput
                rules={{
                  required: {
                    value: true,
                    message: 'A confirmação da senha é obrigatória',
                  },
                }}
                type="password"
                endFunction="password"
                name="confirmNewPassword"
                label="Confirme a senha"
              />
            </Form>
          </FormProvider>
          <ButtonsContainer>
            <StyledConfirmButton
              form={`${randomKey}-password`}
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <CircularProgress size={20} style={{ color: '#FFF' }} />
              ) : (
                'SALVAR'
              )}
            </StyledConfirmButton>
          </ButtonsContainer>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(UpdateProfessionalPasswordModal);
