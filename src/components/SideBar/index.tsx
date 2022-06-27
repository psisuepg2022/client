import React, { useState } from 'react';
import { CloseSharp, Person, ChevronRightSharp } from '@mui/icons-material';
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
import { colors } from '../../global/colors';

const SideBar = (): JSX.Element => {
  const [expanded, setExpanded] = useState<boolean>(true);

  if (!expanded) {
    return (
      <CollapsedContainer>
        <CollapsedHeader>
          <IconButton size="small" onClick={() => setExpanded(true)}>
            <ChevronRightSharp style={{ color: '#FFF', fontSize: 50 }} />
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
            <Person style={{ color: '#FFF', fontSize: 35 }} />
          </CollapsedNavItem>
        ))}
      </CollapsedContainer>
    );
  }

  return (
    <Container>
      <Header>
        <IconButton size="small" onClick={() => setExpanded(false)}>
          <CloseSharp style={{ color: '#FFF', fontSize: 40 }} />
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
            <Person style={{ color: '#FFF', fontSize: 35 }} />
            <NavItemTitle>{item.title}</NavItemTitle>
          </NavItem>
        ))}
      </Content>
    </Container>
  );
};

export default SideBar;
