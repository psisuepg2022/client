import React, { useState } from 'react';
import {
  AdditionalInfos,
  Body,
  ButtonsContainer,
  EventPrimaryText,
  Form,
  Header,
  ScheduleAtDate,
  ScheduleAtText,
  ScheduledAtContainer,
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

type UpdateProfessionalPasswordModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  professional: Professional;
};

const UpdateProfessionalPasswordModal = ({
  open,
  handleClose,
  professional,
}: UpdateProfessionalPasswordModalProps): JSX.Element => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  const [loading, setLoading] = useState<boolean>(false);
  const randomKey = Math.random();

  if (!professional) return <></>;

  if (professional && !professional.id) return <></>;

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    handleClose(reason);
  };

  const onSubmit = async (data: any): Promise<void> => {
    console.log('data', data);
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
                name="password"
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
                name="confirmPassword"
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