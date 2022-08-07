import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import {
  Container,
  Header,
  NavItem,
  Content,
  NavItemTitle,
  CollapsedContainer,
  CollapsedNavItem,
  CollapsedHeader,
} from './styles';
import { sideBarLinks } from './SideBarLinks';
import { colors } from '@global/colors';
import { AiOutlineRight, AiOutlineClose } from 'react-icons/ai';

const SideBar = (): JSX.Element => {
  const [expanded, setExpanded] = useState<boolean>(true);

  if (!expanded) {
    return (
      <CollapsedContainer>
        <CollapsedHeader>
          <IconButton size="small" onClick={() => setExpanded(true)}>
            <AiOutlineRight style={{ color: '#FFF', fontSize: 35 }} />
          </IconButton>
        </CollapsedHeader>
        {sideBarLinks.map((item) => (
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
        <IconButton size="small" onClick={() => setExpanded(false)}>
          <AiOutlineClose style={{ color: '#FFF', fontSize: 35 }} />
        </IconButton>
      </Header>
      <Content>
        {sideBarLinks.map((item) => (
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
      </Content>
    </Container>
  );
};

export default SideBar;
