import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  Container,
  Header,
  NavItem,
  Content,
  NavItemTitle,
  CollapsedContainer,
  CollapsedNavItem,
  CollapsedHeader,
  UserName,
  UserNameContainer,
} from './styles';
import { SideBarLinks, sideBarLinks } from './SideBarLinks';
import { colors } from '@global/colors';
import {
  AiOutlineRight,
  AiOutlineClose,
  AiOutlineInfoCircle,
  AiOutlineQuestionCircle,
} from 'react-icons/ai';
import { useAuth } from '@contexts/Auth';
import ScheduleLabelModal from '@components/ScheduleLabelModal';
import ScheduleHelpModal from '@components/ScheduleHelpModal';

const SideBar = (): JSX.Element => {
  const {
    user: { permissions, name },
    sideBarExpanded,
    setSideBarExpanded,
  } = useAuth();
  const [labelModal, setLabelModal] = useState<boolean>(false);
  const [scheduleHelpModal, setScheduleHelpModal] = useState<boolean>(false);

  const renderLinks = (): SideBarLinks[] => {
    const resultRoutes: SideBarLinks[] = [];

    sideBarLinks.forEach((item) => {
      if (
        item.requiredPermissions.some((permission) =>
          permissions.includes(permission)
        )
      ) {
        resultRoutes.push(item);
      }
    });

    return resultRoutes;
  };

  if (!sideBarExpanded) {
    return (
      <CollapsedContainer>
        <CollapsedHeader>
          <Tooltip title="Expandir">
            <IconButton size="small" onClick={() => setSideBarExpanded(true)}>
              <AiOutlineRight style={{ color: '#FFF', fontSize: 35 }} />
            </IconButton>
          </Tooltip>
        </CollapsedHeader>
        {renderLinks().map((item) => (
          <CollapsedNavItem
            key={item.title}
            to={item.path}
            style={({ isActive }) => ({
              backgroundColor: isActive ? colors.SECONDARY : colors.PRIMARY,
            })}
          >
            {item.icon}
          </CollapsedNavItem>
        ))}
      </CollapsedContainer>
    );
  }

  return (
    <Container>
      <Header>
        <Tooltip title="Recolher">
          <IconButton size="small" onClick={() => setSideBarExpanded(false)}>
            <AiOutlineClose style={{ color: '#FFF', fontSize: 35 }} />
          </IconButton>
        </Tooltip>
      </Header>
      <UserNameContainer>
        {name ? (
          <UserName>
            Bem-vindo(a), <span>{name.split(' ')[0]}</span>
          </UserName>
        ) : (
          <UserName>{'Bem-vindo(a)'}</UserName>
        )}
      </UserNameContainer>
      <Content>
        {scheduleHelpModal ? (
          <ScheduleHelpModal
            open={scheduleHelpModal}
            handleClose={() => setScheduleHelpModal(false)}
          />
        ) : null}
        <div style={{ marginTop: 3 }}>
          {renderLinks().map((item) => (
            <NavItem
              key={item.title}
              to={item.path}
              style={({ isActive }) => ({
                backgroundColor: isActive ? colors.SECONDARY : colors.PRIMARY,
              })}
            >
              {item.icon}
              <NavItemTitle>{item.title}</NavItemTitle>
            </NavItem>
          ))}
        </div>
        <div
          style={{
            justifySelf: 'flex-end',
            alignSelf: 'center',
            marginBottom: 20,
          }}
        >
          {location.pathname === '/schedule' ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Legenda de consultas da agenda">
                <IconButton onClick={() => setLabelModal(true)}>
                  <AiOutlineInfoCircle size={40} style={{ color: '#FFF' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ajuda para os itens da agenda">
                <IconButton onClick={() => setScheduleHelpModal(true)}>
                  <AiOutlineQuestionCircle
                    size={40}
                    style={{ color: '#FFF' }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          ) : null}
          {labelModal && (
            <ScheduleLabelModal
              open={labelModal}
              handleClose={(reason: 'backdropClick' | 'escapeKeyDown' | '') =>
                reason !== 'backdropClick' &&
                reason !== 'escapeKeyDown' &&
                setLabelModal(false)
              }
            />
          )}
        </div>
      </Content>
    </Container>
  );
};

export default SideBar;
