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
import { AiOutlineRight, AiOutlineClose } from 'react-icons/ai';
import { useAuth } from '@contexts/Auth';
import { MdSubtitles } from 'react-icons/md';
import ScheduleLabelModal from '@components/ScheduleLabelModal';

const SideBar = (): JSX.Element => {
  const {
    user: { permissions, name },
    sideBarExpanded,
    setSideBarExpanded,
  } = useAuth();
  const [labelModal, setLabelModal] = useState<boolean>(false);

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
          <IconButton size="small" onClick={() => setSideBarExpanded(true)}>
            <AiOutlineRight style={{ color: '#FFF', fontSize: 35 }} />
          </IconButton>
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
        <IconButton size="small" onClick={() => setSideBarExpanded(false)}>
          <AiOutlineClose style={{ color: '#FFF', fontSize: 35 }} />
        </IconButton>
      </Header>
      <UserNameContainer>
        <UserName>{`Bem-vindo(a)${
          name ? `, ${name.split(' ')[0]}` : ''
        }`}</UserName>
      </UserNameContainer>
      <Content>
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
          {location.pathname === '/schedule' && (
            <Tooltip title="Legenda de consultas da agenda">
              <IconButton onClick={() => setLabelModal(true)}>
                <MdSubtitles size={40} style={{ color: '#FFF' }} />
              </IconButton>
            </Tooltip>
          )}
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
