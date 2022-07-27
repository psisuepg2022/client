/* eslint-disable quotes */
import React from 'react';
import { SlotInfo } from 'react-big-calendar';
import { dateFormat } from '../../utils/dateFormat';
import { Body, Header, SlotDataText, StyledBox, StyledModal } from './styles';
import { MdLock, MdOutlineClose } from 'react-icons/md';
import { IconButton } from '@mui/material';
import { colors } from '../../global/colors';
import SectionDivider from '../SectionDivider';
import AutocompleteInput from '../AutocompleteInput';
import axios from 'axios';
import { Person } from '../../types';

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
  if (!slotInfo) return <></>;

  if (slotInfo && slotInfo.slots && slotInfo.slots.length === 1) return <></>;

  const handleSearch = async (inputValue: string): Promise<Person[]> => {
    const res = await axios.get(
      `http://localhost:3333/patients?name_like=${inputValue}`
    );
    return res.data;
  };

  return (
    <>
      <StyledModal
        open={open}
        onClose={handleClose}
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
              | {dateFormat({ date: slotInfo.start, stringFormat: 'hh:mm' })} -{' '}
              {dateFormat({ date: slotInfo.end, stringFormat: 'hh:mm' })}
            </SlotDataText>
            <IconButton size="small" onClick={handleClose}>
              <MdOutlineClose size={40} />
            </IconButton>
          </Header>
          <Body>
            <SectionDivider>Paciente</SectionDivider>
            <AutocompleteInput
              label="Nome"
              noOptionsText="Nenhum paciente encontrado..."
              callback={handleSearch}
            />
          </Body>
        </StyledBox>
      </StyledModal>
    </>
  );
};

export default CreateEventModal;
