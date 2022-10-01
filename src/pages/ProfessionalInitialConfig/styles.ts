import { Button, Checkbox, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '@global/colors';

export const Container = styled('div')`
  background-color: ${colors.PRIMARY};
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Box = styled('div')`
  width: 90%;
  height: 90%;
  border-radius: 5px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled('div')`
  width: 90%;
  height: 90%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  justify-content: space-between;
`;

export const Header = styled('div')`
  height: 10%;
  width: 100%;
  padding-top: 10px;
  display: flex;
  align-items: center;
`;

export const Body = styled('div')`
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1rem 0 0;
`;

export const LogoContainer = styled('img')`
  width: 100px;
  height: auto;
`;

export const DayHoursAndLocks = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const TimesLabel = styled(Typography)`
  color: ${colors.TEXT};
  font-weight: 600;
  font-size: 1rem;
  padding: 2rem 0 1rem 0;
`;

export const WorkHoursContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  column-gap: 1rem;
  width: 80%;
`;

export const IntervalsContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  column-gap: 1rem;
  padding-bottom: 10px;
  width: 60%;
`;

export const StyledButton = styled(Button)`
  background-color: ${colors.PRIMARY};
  color: #fff;
  transition: 300ms;
  width: 350px;
  font-weight: 400;
  font-size: 1rem;
  height: 50px;
  margin-top: 20px;
  align-self: flex-end;
  padding-bottom: 5px;

  :hover {
    background-color: ${colors.SECONDARY};
  }
`;

export const IntervalRow = styled(Typography)`
  font-size: 1rem;

  span {
    font-weight: 600;
    padding-left: 10px;
  }
`;

export const StyledCheckbox = styled(Checkbox)``;

export const Form = styled('form')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 1rem;
`;

export const PasswordSection = styled('div')`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  width: 30%;
`;

export const BaseDurationSection = styled('div')`
  display: grid;
  width: 30%;
`;

export const WeeklyScheduleSection = styled('div')``;
