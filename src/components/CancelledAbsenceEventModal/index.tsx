import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  AdditionalInfos,
  Body,
  ContactNumberText,
  EventPrimaryText,
  Header,
  IconButtonArea,
  ScheduleAtDate,
  ScheduleAtText,
  ScheduledAtContainer,
  StatusText,
  StyledBox,
  StyledModal,
} from './styles';
import { MdOutlineClose } from 'react-icons/md';
import { colors } from '@global/colors';
import {
  contactNumberFromResource,
  statusFromResource,
  updatedAtFromResource,
} from '@utils/schedule';
import { Event } from 'react-big-calendar';
import { dateFormat } from '@utils/dateFormat';
import { AiFillSchedule, AiOutlineWhatsApp } from 'react-icons/ai';
import { BiLinkExternal } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { contactNumberToWhatsapp } from '@utils/whatsappContact';

type CancelledAbsenceEventModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  eventInfo: Event | undefined;
};

const CancelledAbsenceEventModal = ({
  open,
  handleClose,
  eventInfo,
}: CancelledAbsenceEventModalProps): JSX.Element => {
  if (!eventInfo) return <></>;

  if (eventInfo && !eventInfo.title && !eventInfo.resource) return <></>;

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    handleClose(reason);
  };

  const updatedAtDisplay = (): string => {
    const updateTime = updatedAtFromResource(eventInfo.resource)
      .split('T')[1]
      .substring(0, 5);
    const updateDate = new Date(updatedAtFromResource(eventInfo.resource));
    updateDate.setHours(
      Number(updateTime.split(':')[0]),
      Number(updateTime.split(':')[1]),
      0
    );
    return dateFormat({
      date: updateDate,
      // eslint-disable-next-line quotes
      stringFormat: "d 'de' MMMM 'de' yyyy 'às' HH:mm",
    });
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
          <StatusText>
            Situação: <span>{statusFromResource(eventInfo.resource)}</span>
          </StatusText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0px',
              paddingTop: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EventPrimaryText>{eventInfo.title}</EventPrimaryText>
              <Tooltip title="Navegar para detalhes do paciente">
                <IconButtonArea>
                  <Link
                    to={{ pathname: '/patients' }}
                    onClick={() => {
                      localStorage.setItem(
                        '@psis:goToPatient',
                        `${eventInfo.title}`
                      );
                    }}
                    style={{ height: '20px', width: '20px' }}
                    target="_blank"
                  >
                    <BiLinkExternal
                      style={{
                        color: colors.PRIMARY,
                      }}
                      size={20}
                    />
                  </Link>
                </IconButtonArea>
              </Tooltip>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <ContactNumberText>
                Contato:
                <span>
                  {` ${contactNumberFromResource(eventInfo.resource)}`}
                </span>
              </ContactNumberText>
              <Tooltip title="Utilize este número diretamente no WhatsApp">
                <IconButton>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://wa.me/${contactNumberToWhatsapp(
                      contactNumberFromResource(eventInfo.resource)
                    )}`}
                    style={{ height: '1em', width: '1em' }}
                  >
                    <AiOutlineWhatsApp style={{ color: colors.WHATSAPP }} />
                  </a>
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <EventPrimaryText>
            {dateFormat({
              date: eventInfo.start as Date,
              stringFormat: 'HH:mm',
            })}{' '}
            -{' '}
            {dateFormat({ date: eventInfo.end as Date, stringFormat: 'HH:mm' })}
          </EventPrimaryText>

          <AdditionalInfos>
            <AiFillSchedule style={{ fontSize: 70, color: colors.PRIMARY }} />

            <ScheduledAtContainer>
              <ScheduleAtText>
                {statusFromResource(eventInfo.resource) === 'Cancelado'
                  ? 'Cancelado em:'
                  : 'Ausente em:'}
              </ScheduleAtText>
              <ScheduleAtDate>{updatedAtDisplay()}</ScheduleAtDate>
            </ScheduledAtContainer>
          </AdditionalInfos>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(CancelledAbsenceEventModal);
