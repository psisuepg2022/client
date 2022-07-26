import React from 'react';
import { SlotInfo } from 'react-big-calendar';
import { dateFormat } from '../../utils/dateFormat';
import { Header, SlotDataText, StyledBox, StyledModal } from './styles';
import { MdLock, MdOutlineClose } from 'react-icons/md';
import { IconButton } from '@mui/material';
import { colors } from '../../global/colors';


type CreateEventModalProps = {
  open: boolean;
  handleClose: () => void;
  slotInfo: SlotInfo | undefined;
}

const CreateEventModal = ({ open, handleClose, slotInfo }: CreateEventModalProps): JSX.Element => {

  if (!slotInfo)
    return <></>

  if (slotInfo && slotInfo.slots && slotInfo.slots.length === 1) 
    return <></>

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
            <SlotDataText>{dateFormat({ date: slotInfo.start, stringFormat: "d 'de' MMMM 'de' yyyy" })} | {dateFormat({ date: slotInfo.start, stringFormat: "hh:mm" })} - {dateFormat({ date: slotInfo.end, stringFormat: "hh:mm" })}</SlotDataText>
            <IconButton size="small" onClick={handleClose}>
              <MdOutlineClose size={40} />
            </IconButton>
          </Header>
        </StyledBox>
      </StyledModal>
    </>
  )
}

export default CreateEventModal;