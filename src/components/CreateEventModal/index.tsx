/* eslint-disable quotes */
import React, { useState } from 'react';
import { SlotInfo } from 'react-big-calendar';
import { dateFormat } from '../../utils/dateFormat';
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
import { colors } from '../../global/colors';
import SectionDivider from '../SectionDivider';
import AutocompleteInput from '../AutocompleteInput';
import axios from 'axios';
import { Person, Patient } from '../../types';
import SimpleInput from '../SimpleInput';

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
  const [currentPatient, setCurrentPatient] = useState<Patient>();

  if (!slotInfo) return <></>;

  if (slotInfo && slotInfo.slots && slotInfo.slots.length === 1) return <></>;

  const handleSearch = async (inputValue: string): Promise<Person[]> => {
    const res = await axios.get(
      `http://localhost:3333/patients?name_like=${inputValue}`
    );
    return res.data;
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
                  value={currentPatient.birth_date}
                  contentEditable={false}
                />
              </ConditionalInputs>
            )}
            {currentPatient && !currentPatient.CPF && currentPatient?.liable && (
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
                  value={currentPatient.liable.birth_date}
                  contentEditable={false}
                />
              </ConditionalInputs>
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
