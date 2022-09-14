import React, { createContext, useContext, useState } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { AllScheduleEvents } from '@interfaces/AllScheduleEvents';
import { Professional } from '@models/Professional';
import { AppointmentSave } from '@interfaces/AppointmentSave';

type ScheduleContextData = {
  getScheduleEvents: (
    filter: {
      startDate: string;
      endDate: string;
    },
    professionalId?: string,
    weekly?: boolean
  ) => Promise<Response<AllScheduleEvents>>;
  saveAppointment: (appointmentData: AppointmentSave) => Promise<void>;
  currentProfessional: Professional | undefined;
  setCurrentProfessional: (professional: Professional) => void;
  currentSchedule: AllScheduleEvents | undefined;
  setCurrentSchedule: (schedule: AllScheduleEvents) => void;
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
  const [currentProfessional, setCurrentProfessional] = useState<
    Professional | undefined
  >();
  const [currentSchedule, setCurrentSchedule] = useState<
    AllScheduleEvents | undefined
  >();

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

  const saveAppointment = async (
    appointmentData: AppointmentSave
  ): Promise<void> => {
    const { data }: { data: Response<any> } = await api.post('appointment', {
      ...appointmentData,
    });

    console.log('DATA', data);
  };

  return (
    <ScheduleContext.Provider
      value={{
        getScheduleEvents,
        saveAppointment,
        currentProfessional,
        setCurrentProfessional,
        currentSchedule,
        setCurrentSchedule,
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
