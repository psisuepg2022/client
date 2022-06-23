import React from 'react';
import {
  Container,
  ImageLogo,
  IntroText,
  IntroTextBold,
  LeftContainer,
  LogoAndTitle,
  RightContainer,
  SubTitleRegular,
  TitleAndSubTitle,
  TitleExtense,
  TitleThin,
} from './styles';

import LogoPSIS from '../../assets/PSIS-Logo-Transparente.png';

const Login = (): JSX.Element => {
  return (
    <Container>
      <LeftContainer>
        <TitleAndSubTitle>
          <TitleThin>PSIS</TitleThin>
          <SubTitleRegular>Acesse o painel da sua clínica</SubTitleRegular>
        </TitleAndSubTitle>
      </LeftContainer>
      <RightContainer>
        <LogoAndTitle>
          <ImageLogo src={LogoPSIS} />
          <TitleExtense>Patient And Scheduling Information System</TitleExtense>
        </LogoAndTitle>

        <IntroText>
          Aumente a <IntroTextBold>produtividade</IntroTextBold> da sua clínica
          através do agendamento <IntroTextBold>online</IntroTextBold>.
          <br />
          <IntroTextBold>Rastreabilidade</IntroTextBold> completa de
          funcionários e pacientes.
        </IntroText>
      </RightContainer>
    </Container>
  );
};

export default Login;
