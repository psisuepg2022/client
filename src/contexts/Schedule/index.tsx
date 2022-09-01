import React, { createContext, useContext, useState } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { AllScheduleEvents } from '@interfaces/AllScheduleEvents';

type ScheduleContextData = {
  getScheduleEvents: (
    filter: {
      startDate: string;
      endDate: string;
    },
    professionalId?: string,
    weekly?: boolean
  ) => Promise<Response<AllScheduleEvents>>;
};

type ScheduleProviderProps = {
  children: React.ReactElement;
};

const ScheduleContext = createContext<ScheduleContextData>(
  {} as ScheduleContextData
);

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({
  children,
}: ScheduleProviderProps) => {
  const getScheduleEvents = async (
    filter: {
      startDate: string;
      endDate: string;
    },
    professionalId?: string,
    weekly?: boolean
  ): Promise<Response<AllScheduleEvents>> => {
    const { data }: { data: Response<AllScheduleEvents> } = await api.post(
      professionalId
        ? `appointment/calendar/${professionalId}${
            weekly ? '?weekly=' + weekly : ''
          }`
        : `appointment/calendar${weekly ? '?weekly=' + weekly : ''}`,
      {
        ...filter,
      }
    );

    return data;
  };

  return (
    <ScheduleContext.Provider
      value={{
        getScheduleEvents,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = (): ScheduleContextData => {
  const context = useContext(ScheduleContext);

  if (!context) {
    throw new Error('Este hook deve ser utilizado dentro de seu provider');
  }

  return context;
};
