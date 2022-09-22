import React from 'react';
import AlterTopToolbar from '@components/AlterTopToolbar';
import { Event } from 'react-big-calendar';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppointmentDate,
  BoxHeader,
  CommentsTitle,
  Container,
  Content,
  CustomBox,
  PatientName,
  Body,
} from './style';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { dateFormat } from '@utils/dateFormat';
import { IconButton } from '@mui/material';

const Comment = (): JSX.Element => {
  const { state }: { state: Event } = useLocation() as { state: Event };
  const navigate = useNavigate();

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <BoxHeader>
            <IconButton onClick={() => navigate('/schedule')}>
              <AiOutlineLeft size={40} />
            </IconButton>
            <CommentsTitle>Anotações</CommentsTitle>
            <AiOutlineRight size={25} style={{ color: '#707070' }} />
            <PatientName>{state.title} | </PatientName>
            <AppointmentDate>
              {dateFormat({
                date: state.start as Date,
                // eslint-disable-next-line quotes
                stringFormat: "d 'de' MMMM 'de' yyyy",
              })}{' '}
              <AiOutlineRight size={20} style={{ color: '#707070' }} />{' '}
              {dateFormat({
                date: state.start as Date,
                stringFormat: 'HH:mm',
              })}
              {' - '}
              {dateFormat({
                date: state.end as Date,
                stringFormat: 'HH:mm',
              })}
            </AppointmentDate>
          </BoxHeader>
          <Body dangerouslySetInnerHTML={{ __html: 'some <b>bold</b>' }}></Body>
          {/* https://stackoverflow.com/questions/40952434/how-do-i-display-the-content-of-react-quill-without-the-html-markup */}
        </CustomBox>
      </Content>
    </Container>
  );
};

export default Comment;
