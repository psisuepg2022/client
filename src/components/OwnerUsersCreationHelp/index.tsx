import React from 'react';
import {
  Body,
  EventPrimaryText,
  Header,
  ScheduleAtText,
  StatusText,
  StyledBox,
  StyledModal,
} from './styles';
import { MdOutlineClose } from 'react-icons/md';
import { colors } from '@global/colors';
import { IconButton } from '@mui/material';
import SectionDivider from '@components/SectionDivider';

type OwnerUsersCreationHelpProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  employee?: boolean;
};

const OwnerUsersCreationHelp = ({
  open,
  handleClose,
  employee,
}: OwnerUsersCreationHelpProps): JSX.Element => {
  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    handleClose(reason);
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
          <EventPrimaryText>
            {employee ? 'Funcionário' : 'Profissional'}
          </EventPrimaryText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <div style={{ textIndent: '2rem' }}>
            <StatusText>
              {
                'Como papéis separados, "Funcionário" e "Profissional", é possível que haja necessidade particular de uma mesma pessoa ter dois usuários de papéis diferentes. Portanto, algumas informações únicas podem ser reutilizadas em papéis diferentes.'
              }
            </StatusText>
          </div>

          <SectionDivider>CPF</SectionDivider>

          <div style={{ textIndent: '2rem' }}>
            <ScheduleAtText>
              {
                'É possível criar, por exemplo, um usuário do tipo "Funcionário" e um usuário do tipo "Profissional" ambos com o mesmo CPF. Isso será permitido somente em caso de papéis diferentes e caso o CPF não pertença a um paciente cadastrado.'
              }
            </ScheduleAtText>
          </div>

          <SectionDivider>Nome de usuário</SectionDivider>

          <div style={{ textIndent: '2rem' }}>
            <ScheduleAtText>
              {
                'É possível criar, por exemplo, um usuário do tipo "Funcionário" e um usuário do tipo "Profissional" ambos com o mesmo nome de usuário. Isso será permitido somente em caso de papéis diferentes.'
              }
            </ScheduleAtText>
          </div>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(OwnerUsersCreationHelp);
