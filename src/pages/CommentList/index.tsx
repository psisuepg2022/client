import React, { useEffect, useState } from 'react';
import AlterTopToolbar from '@components/AlterTopToolbar';
import { IconButton } from '@mui/material';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import {
  Container,
  BoxHeader,
  CustomBox,
  Content,
  CommentsTitle,
  LogoContainer,
  PatientName,
} from './styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { Event } from 'react-big-calendar';
import { showAlert } from '@utils/showAlert';

const CommentList = (): JSX.Element => {
  const { state }: { state: Event } = useLocation() as { state: Event };
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  console.log('STATE', state);

  useEffect(() => {
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        showAlert({
          icon: 'error',
          text:
            e?.response?.data?.message ||
            'Ocorreu um problema ao recuperar as consultas',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <BoxHeader>
            <IconButton onClick={() => navigate('/schedule')}>
              <AiOutlineLeft size={40} />
            </IconButton>
            <CommentsTitle>Consultas Concluídas</CommentsTitle>
            <AiOutlineRight size={25} style={{ color: '#707070' }} />
            <PatientName>{state.title}</PatientName>
          </BoxHeader>
        </CustomBox>
      </Content>
    </Container>
  );
};

export default CommentList;
