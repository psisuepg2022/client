import React, { createContext, useContext, useState } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';

type ScheduleContextData = {};

type ScheduleProviderProps = {
  children: React.ReactElement;
};

const ScheduleContext = createContext<ScheduleContextData>(
  {} as ScheduleContextData
);

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({
  children,
}: ScheduleProviderProps) => {
  return (
    <ScheduleContext.Provider value={{}}>{children}</ScheduleContext.Provider>
  );
};

export const useSchedule = (): ScheduleContextData => {
  const context = useContext(ScheduleContext);

  if (!context) {
    throw new Error('Este hook deve ser utilizado dentro de seu provider');
  }

  return context;
};
