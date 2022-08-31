import { Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '@global/colors';

export const Container = styled('div')`
  background-color: #fff;
  height: 100vh;
  width: 100vw;
  display: flex;
`;

export const RightContainer = styled('div')`
  background: linear-gradient(180deg, #419d78 22.4%, #009686 100%);
  height: 100%;
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const LogoAndTitle = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5rem;

  @media (max-width: 1366px) {
    padding: 0 4rem;
  }
`;

export const ImageLogo = styled('img')`
  width: auto;
  max-height: 7rem;
  padding-right: 3rem;

  @media (max-width: 1700px) {
    max-height: 6rem;
    padding-right: 2.5rem;
  }
  @media (max-width: 1440px) {
    max-height: 5.5rem;
    padding-right: 2.2rem;
  }
  @media (max-width: 1024px) {
    max-height: 10rem;
    padding-right: 2rem;
  }
`;

export const TitleExtense = styled(Typography)`
  font-weight: 600;
  color: #fff;
  font-size: 3rem;
  text-align: left;

  @media (max-width: 1700px) {
    font-size: 2.3rem;
  }
  @media (max-width: 1440px) {
    font-size: 2rem;
  }
  @media (max-width: 1366px) {
    font-size: 2rem;
  }
`;

export const IntroText = styled(Typography)`
  font-size: 1.8rem;
  font-weight: 300;
  color: #fff;
  text-align: center;
  padding: 0 9rem;

  @media (max-width: 1440px) {
    font-size: 1.6rem;
    padding: 0 5rem;
  }
  @media (max-width: 1366px) {
    font-size: 1.5rem;
    padding: 0 4rem;
  }
`;

export const IntroTextBold = styled('span')`
  font-size: 1.8rem;
  font-weight: 600;
  color: #fff;

  @media (max-width: 1440px) {
    font-size: 1.6rem;
  }
  @media (max-width: 1366px) {
    font-size: 1.5rem;
  }
`;

/***************************************************************** LEFT SIDE *********************************************************************/

export const LeftContainer = styled('div')`
  background: #fff;
  height: 100%;
  width: 55%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const TitleAndSubTitle = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TitleThin = styled(Typography)`
  font-weight: 100;
  font-size: 8rem;
  color: ${colors.PRIMARY};
`;

export const SubTitleRegular = styled(Typography)`
  color: ${colors.PRIMARY};
  font-size: 1.6rem;

  @media (max-width: 1440px) {
    font-size: 1.4rem;
  }
`;

export const InputsContainer = styled('form')`
  width: 40%;
  height: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  @media (max-width: 1440px) {
    width: 50%;
  }
  @media (max-width: 1366px) {
    width: 55%;
  }
  @media (max-width: 1024px) {
    width: 70%;
  }
`;

export const CodeAndUser = styled('div')`
  display: grid;
  grid-template-columns: 3fr 8fr;
  gap: 1rem;
`;

export const PasswordBox = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
`;

export const StyledButton = styled(Button)`
  background-color: ${colors.PRIMARY};
  color: #fff;
  transition: 300ms;
  width: 100%;
  font-weight: 400;
  font-size: 1rem;
  height: 50px;

  :hover {
    background-color: ${colors.SECONDARY};
  }
`;
