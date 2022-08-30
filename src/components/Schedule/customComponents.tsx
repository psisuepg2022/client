import React from 'react';
import {
  DateHeaderProps,
  Event,
  HeaderProps,
  SlotPropGetter,
} from 'react-big-calendar';
import { colors } from '@global/colors';
import {
  CustomDateHeaderContainer,
  CustomDateHeaderContent,
  CustomDateHeaderLink,
  CustomDateHeaderText,
  CustomHeaderMonthText,
} from './styles';
import { EventStatus } from '@interfaces/EventStatus';
import { eventColor } from '@utils/eventColor';

export const eventStyleGetter = (
  event: Event
): { style?: Record<string, unknown>; className?: string } => {
  if (event.resource && event.resource === 'lock') {
    const style = {
      backgroundColor: colors.LOCK,
      borderRadius: '0px',
      color: 'transparent',
      cursor: 'auto',
      width: '100%',
      border: '1px',
    };

    return {
      style: style,
      className: 'eventDefault',
    };
  }

  const status: EventStatus = event.resource;

  const style = {
    backgroundColor: eventColor(status),
    borderRadius: '2px',
    color: colors.TEXT,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: 'Poppins',
    border: '0px',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 500,
  };

  return {
    style: style,
    className: 'eventDefault',
  };
};

type CustomDateHeaderProps = {
  events: Event[];
} & DateHeaderProps;

export const CustomDateHeader = ({
  label,
  drilldownView,
  onDrillDown,
  date,
  events,
}: CustomDateHeaderProps) => {
  const eventsInDate = events.reduce(
    (prev, cur) =>
      cur.start?.getDate() === date.getDate() &&
      cur.start.getMonth() === date.getMonth() &&
      cur.start.getFullYear() === date.getFullYear() &&
      cur.resource !== 'lock'
        ? prev + 1
        : prev,
    0
  );

  return (
    <CustomDateHeaderContainer>
      <CustomDateHeaderContent>
        <CustomDateHeaderText>{eventsInDate}</CustomDateHeaderText>
      </CustomDateHeaderContent>
      <CustomDateHeaderLink href="#" onClick={onDrillDown}>
        {label}
      </CustomDateHeaderLink>
    </CustomDateHeaderContainer>
  );
};

export const CustomHeaderMonth = ({ date, label }: HeaderProps) => {
  return (
    <div>
      <CustomHeaderMonthText>{label}</CustomHeaderMonthText>
    </div>
  );
};

export const CustomEventMonth = () => {
  return <></>;
};

export const slotPropGetter: SlotPropGetter = () => {
  return {
    style: {
      backgroundColor: '#FFF',
      color: colors.TEXT,
      cursor: 'pointer !important',
    },
  };
};

export const dayPropGetter = (): {
  style?: Record<string, unknown>;
  className?: string;
} => {
  return {
    className: '',
    style: {},
  };
};

export const CustomEventWrapper = (props: any) => {
  const { children } = props;

  return <div>{children}</div>;
};

export const CustomHeaderWeek = ({ date, label }: HeaderProps) => {
  return (
    <div>
      <CustomHeaderMonthText>{label}</CustomHeaderMonthText>
    </div>
  );
};
