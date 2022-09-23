/* eslint-disable quotes */
import React, { useState } from 'react';
import { Event, SlotInfo } from 'react-big-calendar';
import { dateFormat } from '@utils/dateFormat';
import {
  Body,
  ButtonArea,
  ConditionalInputs,
  Header,
  SlotDataText,
  StyledBox,
  StyledButton,
  StyledModal,
  TimePickerContainer,
} from './styles';
import { MdLock, MdOutlineClose } from 'react-icons/md';
import { AiOutlineLeft } from 'react-icons/ai';
import { CircularProgress, IconButton } from '@mui/material';
import { colors } from '@global/colors';
import SectionDivider from '../SectionDivider';
import AutocompleteInput from '../AutocompleteInput';
import { Patient } from '@models/Patient';
import { Person } from '@models/Person';
import SimpleInput from '../SimpleInput';
import { api } from '@service/index';
import { useSchedule } from '@contexts/Schedule';
import { Response } from '@interfaces/Response';
import { ItemList } from '@interfaces/ItemList';
import { AutocompletePatient } from '@interfaces/AutocompletePatient';
import { showAlert } from '@utils/showAlert';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledTimePicker from '@components/ControlledTimePicker';
import { useAuth } from '@contexts/Auth';

type CreateEventModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  slotInfo: SlotInfo | undefined;
  addNewEvent: (event: Event) => void;
};

const CreateEventModal = ({
  open,
  handleClose,
  slotInfo,
  addNewEvent,
}: CreateEventModalProps): JSX.Element => {
  const { currentProfessional, saveAppointment, saveScheduleLock } =
    useSchedule();
  const {
    user: { permissions },
  } = useAuth();
  const formMethods = useForm<{ start: Date; end: Date }>();
  const { handleSubmit } = formMethods;
  const [currentPatient, setCurrentPatient] = useState<Patient>();
  const [loading, setLoading] = useState<boolean>(false);
  const [lockMode, setLockMode] = useState<boolean>(false);

  if (!slotInfo) return <></>;

  if (slotInfo && slotInfo.slots && slotInfo.slots.length === 1) return <></>;

  const handleSearch = async (
    inputValue: string
  ): Promise<AutocompletePatient[]> => {
    try {
      const res: { data: Response<ItemList<AutocompletePatient>> } =
        await api.post('appointment/autocomplete_patient', {
          name: inputValue,
        });

      return res?.data?.content?.items || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        text: e?.response?.data?.message || 'Ocorreu um problema inesperado',
      });
      return [];
    }
  };

  const selectPerson = (patient: Person | Patient): void => {
    setCurrentPatient(patient as Patient);
  };

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    setCurrentPatient(undefined);
    setLockMode(false);
    handleClose(reason);
  };

  const onSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      const date = dateFormat({
        date: slotInfo.start,
        stringFormat: 'yyyy-MM-dd',
      });
      const startTime = dateFormat({
        date: slotInfo.start,
        stringFormat: 'HH:mm',
      });
      const endTime = dateFormat({ date: slotInfo.end, stringFormat: 'HH:mm' });

      const savedEvent = await saveAppointment({
        date,
        startTime,
        endTime,
        professionalId: currentProfessional?.id || '',
        patientId: currentPatient?.id || '',
      });

      const newAppointment: Event = {
        title: `${currentPatient?.name}`,
        start: slotInfo.start,
        end: slotInfo.end,
        resource: `${savedEvent.content?.status}/${savedEvent.content?.id}/${savedEvent.content?.updatedAt}`,
      };

      addNewEvent(newAppointment);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        text: e?.response?.data?.message || 'Ocorreu um problema inesperado',
        icon: 'error',
      });
    } finally {
      setLoading(false);
      closeAll('');
    }
  };

  const createScheduleLocks = async (data: {
    start: Date;
    end: Date;
  }): Promise<void> => {
    try {
      const date = dateFormat({
        date: slotInfo.start,
        stringFormat: 'yyyy-MM-dd',
      });
      const startTime = dateFormat({
        date: data.start,
        stringFormat: 'HH:mm',
      });
      const endTime = dateFormat({
        date: data.end,
        stringFormat: 'HH:mm',
      });
      setLoading(true);
      const { content } = await saveScheduleLock({
        date,
        startTime,
        endTime,
      });

      console.log('REUTRN', content);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text: e?.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledModal
        open={open}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClose={(event: any, reason: 'backdropClick' | 'escapeKeyDown') =>
          closeAll(reason)
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {lockMode ? (
          <StyledBox>
            <Header>
              <IconButton onClick={() => setLockMode(false)}>
                <AiOutlineLeft size={30} />
              </IconButton>
              <SlotDataText>
                {dateFormat({
                  date: slotInfo.start,
                  stringFormat: "d 'de' MMMM 'de' yyyy",
                })}
              </SlotDataText>
              <IconButton
                disabled={loading}
                size="small"
                onClick={() => closeAll('')}
              >
                <MdOutlineClose size={40} />
              </IconButton>
            </Header>
            <Body>
              <SectionDivider>Criar uma restrição de horário</SectionDivider>

              <FormProvider {...formMethods}>
                <TimePickerContainer
                  id="form"
                  onSubmit={handleSubmit(createScheduleLocks)}
                >
                  <ControlledTimePicker
                    name="start"
                    label="Início"
                    defaultValue={'11:00'}
                  />
                  <ControlledTimePicker
                    name="end"
                    label="Fim"
                    defaultValue={'11:00'}
                  />
                </TimePickerContainer>
              </FormProvider>

              <ButtonArea>
                <StyledButton form="form" type="submit">
                  {loading ? (
                    <CircularProgress style={{ color: '#FFF' }} size={20} />
                  ) : (
                    'CRIAR RESTRIÇÃO'
                  )}
                </StyledButton>
              </ButtonArea>
            </Body>
          </StyledBox>
        ) : (
          <StyledBox>
            <Header>
              {permissions.includes('CREATE_APPOINTMENT') || currentPatient ? (
                <IconButton size="small" disabled>
                  <MdOutlineClose size={40} color="#FFF" />
                </IconButton>
              ) : (
                <IconButton onClick={() => setLockMode(true)}>
                  <MdLock size={30} color={colors.DANGER} />
                </IconButton>
              )}
              <SlotDataText>
                {dateFormat({
                  date: slotInfo.start,
                  stringFormat: "d 'de' MMMM 'de' yyyy",
                })}{' '}
                | {dateFormat({ date: slotInfo.start, stringFormat: 'HH:mm' })}{' '}
                - {dateFormat({ date: slotInfo.end, stringFormat: 'HH:mm' })}
              </SlotDataText>
              <IconButton
                disabled={loading}
                size="small"
                onClick={() => closeAll('')}
              >
                <MdOutlineClose size={40} />
              </IconButton>
            </Header>
            {permissions.includes('CREATE_APPOINTMENT') && (
              <Body>
                <SectionDivider>Paciente</SectionDivider>
                <AutocompleteInput
                  label="Nome"
                  noOptionsText="Nenhum paciente encontrado..."
                  callback={handleSearch}
                  selectCallback={selectPerson}
                  cleanseAfterSelect={() => setCurrentPatient(undefined)}
                />
                {currentPatient && (
                  <ConditionalInputs>
                    <SimpleInput
                      name="CPF"
                      label="CPF"
                      value={
                        !currentPatient.CPF && currentPatient.liable
                          ? currentPatient.liable.CPF
                          : currentPatient.CPF
                      }
                      contentEditable={false}
                    />
                    <SimpleInput
                      name="contactNumber"
                      label="Telefone"
                      value={currentPatient.contactNumber}
                      contentEditable={false}
                    />
                  </ConditionalInputs>
                )}
                {currentPatient &&
                  !currentPatient.CPF &&
                  currentPatient?.liable && (
                    <>
                      <SectionDivider>Responsável</SectionDivider>
                      <SimpleInput
                        name="liable-name"
                        label="Nome"
                        value={currentPatient.liable.name}
                        contentEditable={false}
                      />
                      <ConditionalInputs>
                        <SimpleInput
                          name="CPF"
                          label="CPF"
                          value={currentPatient.liable.CPF}
                          contentEditable={false}
                        />
                        <SimpleInput
                          name="contactNumber"
                          label="Telefone"
                          value={currentPatient.contactNumber}
                          contentEditable={false}
                        />
                      </ConditionalInputs>
                    </>
                  )}
                <ButtonArea>
                  <StyledButton onClick={onSubmit}>
                    {loading ? (
                      <CircularProgress style={{ color: '#FFF' }} size={20} />
                    ) : (
                      'AGENDAR'
                    )}
                  </StyledButton>
                </ButtonArea>
              </Body>
            )}
          </StyledBox>
        )}
      </StyledModal>
    </>
  );
};

export default CreateEventModal;
