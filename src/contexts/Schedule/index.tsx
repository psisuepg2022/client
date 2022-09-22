import React, { createContext, useContext, useState } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { AllScheduleEvents } from '@interfaces/AllScheduleEvents';
import { Professional } from '@models/Professional';
import { AppointmentSave } from '@interfaces/AppointmentSave';
import { SavedEvent } from '@interfaces/SavedEvent';
import { Event } from 'react-big-calendar';
import { WeeklySchedule } from '@models/WeeklySchedule';
import { LockSave } from '@interfaces/LockSave';
import { SavedLock } from '@interfaces/SavedLock';
import { UpdatedEvent } from '@interfaces/UpdatedEvent';
import { AppointmentComments } from '@interfaces/AppointmentComments';

type ScheduleContextData = {
  getScheduleEvents: (
    filter: {
      startDate: string;
      endDate: string;
    },
    professionalId?: string,
    weekly?: boolean
  ) => Promise<Response<AllScheduleEvents>>;
  saveAppointment: (
    appointmentData: AppointmentSave
  ) => Promise<Response<SavedEvent>>;
  updateAppointmentStatus: (
    appointmentId: string,
    status: string
  ) => Promise<Response<UpdatedEvent>>;
  getById: (appointmentId: string) => Promise<Response<AppointmentComments>>;
  saveScheduleLock: (lockData: LockSave) => Promise<Response<SavedLock>>;
  currentProfessional: Professional | undefined;
  setCurrentProfessional: (professional: Professional) => void;
  currentSchedule: AllScheduleEvents | undefined;
  setCurrentSchedule: (schedule: AllScheduleEvents) => void;
  scheduleLoading: boolean;
  setScheduleLoading: (state: boolean) => void;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  retrievedWeeklySchedule: WeeklySchedule[];
  setRetrievedWeeklySchedule: (weeklySchedule: WeeklySchedule[]) => void;
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
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [retrievedWeeklySchedule, setRetrievedWeeklySchedule] = useState<
    WeeklySchedule[]
  >([]);

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
  ): Promise<Response<SavedEvent>> => {
    const { data }: { data: Response<SavedEvent> } = await api.post(
      'appointment',
      {
        ...appointmentData,
      }
    );

    return data;
  };

  const saveScheduleLock = async (
    lockData: LockSave
  ): Promise<Response<SavedLock>> => {
    const { data }: { data: Response<SavedLock> } = await api.post(
      lockData?.professionalId
        ? `schedule_locks/${lockData.professionalId}`
        : 'schedule_locks',
      {
        date: lockData.date,
        startTime: lockData.startTime,
        endTime: lockData.endTime,
      }
    );

    return data;
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: string
  ): Promise<Response<UpdatedEvent>> => {
    const { data }: { data: Response<UpdatedEvent> } = await api.patch(
      `appointment/status/${appointmentId}`,
      {
        status,
      }
    );

    return data;
  };

  const getById = async (
    appointmentId: string
  ): Promise<Response<AppointmentComments>> => {
    const { data }: { data: Response<AppointmentComments> } = await api.get(
      `appointment/${appointmentId}`
    );

    return data;
  };

  return (
    <ScheduleContext.Provider
      value={{
        getScheduleEvents,
        saveAppointment,
        saveScheduleLock,
        updateAppointmentStatus,
        currentProfessional,
        setCurrentProfessional,
        currentSchedule,
        setCurrentSchedule,
        scheduleLoading,
        setScheduleLoading,
        events,
        setEvents,
        retrievedWeeklySchedule,
        setRetrievedWeeklySchedule,
        getById,
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
