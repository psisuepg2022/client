import React from 'react';
import {
  Container,
  LogoAndMain,
  LogoContainer,
  MainText,
  MainTextContainer,
  MainTitle,
  SecondarySection,
  SecondaryText,
  StyledButton,
} from './styles';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import { useNavigate } from 'react-router-dom';

const NotFound = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Container>
      <LogoAndMain>
        <LogoContainer src={logoPSIS} />

        <MainTextContainer>
          <MainTitle>404</MainTitle>
          <MainText>Ops! Não era pra você ter visto isso</MainText>
        </MainTextContainer>
      </LogoAndMain>
      <SecondarySection>
        <SecondaryText>Volte para a página inicial, e lembre:</SecondaryText>
        <SecondaryText>Você não viu nada!</SecondaryText>

        <StyledButton onClick={() => navigate('/agenda')}>
          VOLTAR PARA O INÍCIO
        </StyledButton>
      </SecondarySection>
    </Container>
  );
};

export default NotFound;
