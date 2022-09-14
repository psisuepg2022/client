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
import { IconButton } from '@mui/material';
import { colors } from '@global/colors';
import SectionDivider from '../SectionDivider';
import AutocompleteInput from '../AutocompleteInput';
import { Patient } from '@models/Patient';
import { Person } from '@models/Person';
import SimpleInput from '../SimpleInput';
import { api } from '@service/index';
import { useSchedule } from '@contexts/Schedule';

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
  const { currentProfessional } = useSchedule();
  const [currentPatient, setCurrentPatient] = useState<Patient>();

  if (!slotInfo) return <></>;

  if (slotInfo && slotInfo.slots && slotInfo.slots.length === 1) return <></>;

  console.log('SLOTINJFO', slotInfo, currentProfessional);

  const handleSearch = async (inputValue: string): Promise<Person[]> => {
    const res = await api.post('appointment/autocomplete_patient', {
      name: inputValue,
    });
    console.log('REAS', res);
    return res.data.content;
  };

  const selectPerson = (patient: Person | Patient): void => {
    console.log('I SELECTED', patient);
    setCurrentPatient(patient as Patient);
  };

  const closeAll = (): void => {
    setCurrentPatient(undefined);
    handleClose();
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
                  name="birthdate"
                  label="Data de nascimento"
                  value={currentPatient.birthDate}
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
                    name="birthdate"
                    label="Data de nascimento"
                    value={currentPatient.liable.birthDate}
                    contentEditable={false}
                  />
                </ConditionalInputs>
              </>
            )}
            <ButtonArea>
              <StyledButton>AGENDAR</StyledButton>
            </ButtonArea>
          </Body>
        </StyledBox>
      </StyledModal>
    </>
  );
};

export default CreateEventModal;
