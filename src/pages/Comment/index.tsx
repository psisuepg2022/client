import React, { useEffect, useRef, useState } from 'react';
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
  LogoContainer,
} from './style';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { dateFormat } from '@utils/dateFormat';
import { IconButton, /*Modal,*/ Tooltip } from '@mui/material';
import { useSchedule } from '@contexts/Schedule';
import { showAlert } from '@utils/showAlert';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { isoToDate } from '@utils/isoToDate';
import { useAuth } from '@contexts/Auth';
import { idFromResource } from '@utils/schedule';
import TextEditor from '@components/TextEditor';
import { MdModeEdit /*, MdOutlinePictureAsPdf */ } from 'react-icons/md';
import { useComments } from '@contexts/Comments';
import { showToast } from '@utils/showToast';
import { colors } from '@global/colors';

const Comment = (): JSX.Element => {
  const { state }: { state: Event } = useLocation() as { state: Event };
  const navigate = useNavigate();
  const {
    user: { baseDuration },
    /*sideBarExpanded,*/
  } = useAuth();
  const { getById } = useSchedule();
  const { create /*, generatePDF*/ } = useComments();
  const [loading, setLoading] = useState<boolean>(true);
  // const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [initialComment, setInitialComment] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editorId, setEditorId] = useState<string>(`${Math.random()}`);
  const changesRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const appointmentId = idFromResource(state.resource);
        const { content } = await getById(appointmentId);

        const purifiedComment = DOMPurify.sanitize(content?.comments || '');

        setComment(`${parse(purifiedComment)}`);
        setInitialComment(`${parse(purifiedComment)}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        showAlert({
          icon: 'error',
          text:
            e?.response?.data?.message ||
            'Ocorreu um problema ao recuperar as anotações para essa consulta',
          allowOutsideClick: false,
        }).then(async (result) => {
          if (result.isConfirmed) {
            navigate('/schedule');
          }
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [state.resource]);

  const commentAltered = (): void => {
    changesRef.current = true;
  };

  const editAction = (): void => {
    if (changesRef.current) {
      showAlert({
        title: 'Atenção!',
        icon: 'warning',
        text: 'Existem alterações não salvas, clique em "CANCELAR" para voltar à edição e salvar, ou clique em "NÃO SALVAR" para descartar as alterações.',
        allowOutsideClick: false,
        showCancelButton: true,
        cancelButtonColor: colors.BACKGREY,
        cancelButtonText: '<span style="color: #000;"> CANCELAR</span>',
        confirmButtonText: 'NÃO SALVAR',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setComment(initialComment);
          setEditorId(`${Math.random()}`);
          changesRef.current = false;
          setEditMode(false);
          return;
        }
        if (result.isDismissed) {
          setEditMode(true);
          return;
        }
      });
      return;
    }
    setEditMode((prev) => !prev);
  };

  const goBackAction = (): void => {
    if (changesRef.current) {
      showAlert({
        title: 'Atenção!',
        icon: 'warning',
        text: 'Existem alterações não salvas, clique em "CANCELAR" para voltar à edição e salvar, ou clique em "NÃO SALVAR" para descartar as alterações e voltar.',
        allowOutsideClick: false,
        showCancelButton: true,
        cancelButtonColor: colors.BACKGREY,
        cancelButtonText: '<span style="color: #000;"> CANCELAR</span>',
        confirmButtonText: 'NÃO SALVAR',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setComment(initialComment);
          setEditorId(`${Math.random()}`);
          changesRef.current = false;
          setEditMode(false);
          navigate(-1);
          return;
        }
        if (result.isDismissed) {
          setEditMode(true);
          return;
        }
      });
      return;
    }
    navigate(-1);
  };

  const saveComment = async (text: string) => {
    try {
      const appointmentId = idFromResource(state.resource);

      const { content } = await create(appointmentId, text);

      if (!content) {
        showAlert({
          icon: 'error',
          text: 'Ocorreu um problema ao atualizar a consulta',
        });
      } else {
        showToast({
          text: 'Operação realizada com sucesso!',
        });
      }

      changesRef.current = false;
      setEditMode(false);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao editar a anotação',
      });
    }
  };

  // const exportToPDF = async (): Promise<void> => {
  //   try {
  //     setPdfLoading(true);

  //     const appointmentId = idFromResource(state.resource);

  //     const fileURL = await generatePDF(appointmentId);

  //     window.open(fileURL, '_blank');

  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (e: any) {
  //     showAlert({
  //       icon: 'error',
  //       text:
  //         e?.response?.data?.message ||
  //         'Ocorreu um problema ao exportar a anotação',
  //     });
  //   } finally {
  //     setPdfLoading(false);
  //   }
  // };

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
      {/* <Modal
        open={pdfLoading}
        sx={{
          display: 'flex',
          height: '100%',
          minWidth: sideBarExpanded
            ? 'calc(100vw - 250px)'
            : 'calc(100vw- 70px)',
          justifyContent: 'center',
          alignItems: 'center ',
        }}
      >
        <>
          <CircularProgressWithContent
            content={<LogoContainer src={logoPSIS} />}
            size={200}
          />
        </>
      </Modal> */}
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <BoxHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <IconButton onClick={goBackAction}>
                <AiOutlineLeft size={40} />
              </IconButton>
              <CommentsTitle>Anotações</CommentsTitle>
              <AiOutlineRight size={25} style={{ color: '#707070' }} />
              <PatientName>{state.title} | </PatientName>
              <AppointmentDate>
                {dateFormat({
                  date: !state.end
                    ? isoToDate(`${state.start}`)
                    : (state.start as Date),
                  // eslint-disable-next-line quotes
                  stringFormat: "d 'de' MMMM 'de' yyyy",
                })}{' '}
                <AiOutlineRight size={20} style={{ color: '#707070' }} />{' '}
                {dateFormat({
                  date: !state.end
                    ? isoToDate(`${state.start}`)
                    : (state.start as Date),
                  stringFormat: 'HH:mm',
                })}
                {' - '}
                {dateFormat({
                  date: !state.end
                    ? isoToDate(`${state.start}`, true, Number(baseDuration))
                    : (state.end as Date),
                  stringFormat: 'HH:mm',
                })}
              </AppointmentDate>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* <Tooltip title="Gerar PDF">
                <IconButton
                  onClick={exportToPDF}
                  disabled={pdfLoading || editMode}
                  style={{ justifySelf: 'flex-end' }}
                >
                  <MdOutlinePictureAsPdf size={40} />
                </IconButton>
              </Tooltip> */}
              <Tooltip title={editMode ? 'Parar de editar' : 'Editar'}>
                <IconButton
                  onClick={editAction}
                  //disabled={pdfLoading}
                  style={{ justifySelf: 'flex-end' }}
                >
                  <MdModeEdit size={40} />
                </IconButton>
              </Tooltip>
            </div>
          </BoxHeader>
          <TextEditor
            key={editorId}
            comment={comment}
            readOnly={!editMode}
            saveComment={saveComment}
            commentAltered={commentAltered}
          />
        </CustomBox>
      </Content>
    </Container>
  );
};

export default Comment;
