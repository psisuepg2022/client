/* eslint-disable quotes */
import React, { useState } from 'react';
import ControlledTimePicker from '@components/ControlledTimePicker';
import { IconButton, Typography } from '@mui/material';
import {
  StyledModal,
  Header,
  StyledBox,
  Body,
  SlotDataText,
  StyledButton,
  ButtonArea,
  TimePickerContainer,
} from './styles';
import { MdOutlineClose } from 'react-icons/md';
import { FormProvider, useForm } from 'react-hook-form';
import SectionDivider from '@components/SectionDivider';
import { dateToTime, timeToDate } from '@utils/timeToDate';
import { differenceInMinutes, isAfter } from 'date-fns';
import { isEqual } from 'lodash';
import { useAuth } from '@contexts/Auth';
import { colors } from '@global/colors';

type FormLock = {
  id?: string;
  startTime: string;
  endTime: string;
};

type CreateScheduleLockModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  addNewLock: (lock: FormLock) => void;
  checkDuplicates: (lock: FormLock) => boolean;
};

const CreateScheduleLockModal = ({
  addNewLock,
  handleClose,
  open,
  checkDuplicates,
}: CreateScheduleLockModalProps): JSX.Element => {
  const formMethods = useForm<{ start: Date; end: Date }>();
  const { handleSubmit, setError } = formMethods;
  const { user } = useAuth();
  const [durationError, setDurationError] = useState<string>('');

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    setDurationError('');
    handleClose(reason);
  };

  const createIntervals = (data: { start: Date; end: Date }): void => {
    if (isAfter(data.start, data.end) || isEqual(data.start, data.end)) {
      setError('end', {
        message: 'O horário final deve ser maior que o inicial',
      });
      setDurationError('');
      return;
    }

    if (
      differenceInMinutes(data.end, data.start) % (user.baseDuration as number)
    ) {
      setError('end', { message: '' });
      setError('start', { message: '' });
      setDurationError(
        `O intervalo entre os horários deve corresponder à duração base: ${user.baseDuration} minutos`
      );
      return;
    }

    if (
      checkDuplicates({
        startTime: dateToTime(data.start),
        endTime: dateToTime(data.end),
      })
    ) {
      setDurationError('Já existe um intervalo com os mesmos início e fim');
      return;
    }

    addNewLock({
      startTime: dateToTime(data.start),
      endTime: dateToTime(data.end),
    });
    closeAll('');
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
          <MdOutlineClose size={40} style={{ color: '#FFF' }} />
          <SlotDataText>Criar novo intervalo</SlotDataText>
          <IconButton size="small" onClick={() => closeAll('')}>
            <MdOutlineClose size={40} />
          </IconButton>
        </Header>
        <Body>
          <SectionDivider>Criar uma restrição de horário</SectionDivider>

          <FormProvider {...formMethods}>
            <TimePickerContainer
              id="locks"
              onSubmit={handleSubmit(createIntervals)}
            >
              <ControlledTimePicker
                name="start"
                label="Início"
                defaultValue={timeToDate('00:00')}
              />
              <ControlledTimePicker
                name="end"
                label="Fim"
                defaultValue={timeToDate('00:00')}
              />
            </TimePickerContainer>
          </FormProvider>

          {durationError !== '' && (
            <Typography style={{ color: colors.DANGER, fontSize: 14 }}>
              {durationError}
            </Typography>
          )}

          <ButtonArea>
            <StyledButton form="locks" type="submit">
              CRIAR INTERVALO
            </StyledButton>
          </ButtonArea>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(CreateScheduleLockModal);
