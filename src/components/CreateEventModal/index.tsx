/* eslint-disable quotes */
import React, { useState } from 'react';
import { SlotInfo } from 'react-big-calendar';
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
} from './styles';
import { MdLock, MdOutlineClose } from 'react-icons/md';
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
import { format } from 'date-fns';

type CreateEventModalProps = {
  open: boolean;
  handleClose: () => void;
  slotInfo: SlotInfo | undefined;
};

const CreateEventModal = ({
  open,
  handleClose,
  slotInfo,
}: CreateEventModalProps): JSX.Element => {
  const { currentProfessional, saveAppointment } = useSchedule();
  const [currentPatient, setCurrentPatient] = useState<Patient>();
  const [loading, setLoading] = useState<boolean>(false);

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

  const closeAll = (): void => {
    setCurrentPatient(undefined);
    handleClose();
  };

  const onSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      const date = format(slotInfo.start, 'yyyy-MM-dd');
      const startTime = format(slotInfo.start, 'HH:mm');
      const endTime = format(slotInfo.end, 'HH:mm');

      await saveAppointment({
        date,
        startTime,
        endTime,
        professionalId: currentProfessional?.id || '',
        patientId: currentPatient?.id || '',
      });
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
    <>
      <StyledModal
        open={open}
        onClose={closeAll}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <Header>
            <IconButton>
              <MdLock size={30} color={colors.DANGER} />
            </IconButton>
            <SlotDataText>
              {dateFormat({
                date: slotInfo.start,
                stringFormat: "d 'de' MMMM 'de' yyyy",
              })}{' '}
              | {dateFormat({ date: slotInfo.start, stringFormat: 'HH:mm' })} -{' '}
              {dateFormat({ date: slotInfo.end, stringFormat: 'HH:mm' })}
            </SlotDataText>
            <IconButton size="small" onClick={closeAll}>
              <MdOutlineClose size={40} />
            </IconButton>
          </Header>
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
            {currentPatient && !currentPatient.CPF && currentPatient?.liable && (
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
        </StyledBox>
      </StyledModal>
    </>
  );
};

export default CreateEventModal;
