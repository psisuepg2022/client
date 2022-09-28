import React, { useEffect, useState } from 'react';
import AlterTopToolbar from '@components/AlterTopToolbar';
import { IconButton, TablePagination, Tooltip } from '@mui/material';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import {
  Container,
  BoxHeader,
  CustomBox,
  Content,
  CommentsTitle,
  LogoContainer,
  PatientName,
  CommentBox,
  ScheduleStatus,
} from './styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { showAlert } from '@utils/showAlert';
import { useComments } from '@contexts/Comments';
import { Patient } from '@models/Patient';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import { PageSize } from '@global/constants';
import { colors } from '@global/colors';
import { isoToDate } from '@utils/isoToDate';
import { dateFormat } from '@utils/dateFormat';
import { useAuth } from '@contexts/Auth';

const CommentList = (): JSX.Element => {
  const { state }: { state: Patient } = useLocation() as { state: Patient };
  const navigate = useNavigate();
  const {
    user: { baseDuration },
  } = useAuth();
  const { list, comments, count } = useComments();
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await list(
          {
            size: PageSize,
            page,
          },
          state.id
        );
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
  }, [page]);

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <CircularProgressWithContent
          content={<LogoContainer src={logoPSIS} />}
          size={200}
        />
      </div>
    );

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <BoxHeader>
            <IconButton onClick={() => navigate(-1)}>
              <AiOutlineLeft size={40} />
            </IconButton>
            <CommentsTitle>Anotações</CommentsTitle>
            <AiOutlineRight size={25} style={{ color: '#707070' }} />
            <PatientName>{state.name}</PatientName>
          </BoxHeader>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {comments.map((comment) => (
                <CommentBox key={comment.appointmentDate}>
                  <ScheduleStatus>
                    Agendada em: <span>{comment.scheduledAt}</span>
                  </ScheduleStatus>
                  <ScheduleStatus>
                    Data:{' '}
                    <span>
                      {dateFormat({
                        date: isoToDate(`${comment.appointmentDate}`),
                        stringFormat: 'dd/MM/yyyy | HH:mm',
                      })}
                      {' - '}
                      {dateFormat({
                        date: isoToDate(
                          `${comment.appointmentDate}`,
                          true,
                          baseDuration
                        ),
                        stringFormat: 'HH:mm',
                      })}
                    </span>
                  </ScheduleStatus>
                  <ScheduleStatus>
                    Concluída em: <span>{comment.completedAt}</span>
                  </ScheduleStatus>
                  <Tooltip title="Abrir anotação">
                    <IconButton
                      style={{
                        width: 45,
                        height: 45,
                        justifySelf: 'flex-end',
                        marginRight: 20,
                      }}
                      onClick={() => {
                        navigate('/comment', {
                          state: {
                            start: comment.appointmentDate,
                            title: state.name,
                            resource: `CONCLUDED/${comment.id}`,
                          },
                        });
                      }}
                    >
                      <BsFillArrowRightCircleFill
                        size={35}
                        style={{ color: colors.PRIMARY }}
                      />
                    </IconButton>
                  </Tooltip>
                </CommentBox>
              ))}
            </div>
            <TablePagination
              sx={{ overflow: 'hidden', minHeight: 60 }}
              rowsPerPageOptions={[]}
              component="div"
              count={count}
              rowsPerPage={PageSize}
              page={page}
              onPageChange={(e, page) => setPage(page)}
            />
          </div>
        </CustomBox>
      </Content>
    </Container>
  );
};

export default CommentList;
