import React, { createContext, useContext, useState } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { SearchFilter } from '@interfaces/SearchFilter';
import { ItemList } from '@interfaces/ItemList';
import {
  FormProfessional,
  Professional,
  UpdateProfessional,
} from '@models/Professional';
import { UpdateWeeklySchedule, WeeklySchedule } from '@models/WeeklySchedule';

type ListProps = {
  page?: number;
  size?: number;
  filter?: SearchFilter;
};

type ProfessionalsContextData = {
  list: (listProps: ListProps) => Promise<Response<ItemList<Professional>>>;
  create: (professional: FormProfessional) => Promise<Response<Professional>>;
  remove: (professionalId: string) => Promise<Response<boolean>>;
  getProfile: () => Promise<Response<Professional>>;
  updateProfile: (
    professional: UpdateProfessional
  ) => Promise<Response<Professional>>;
  getWeeklySchedule: () => Promise<Response<WeeklySchedule[]>>;
  updateWeeklySchedule: (
    weeklySchedule: UpdateWeeklySchedule
  ) => Promise<Response<WeeklySchedule>>;
  deleteLock: (weeklyId: string, lockId: string) => Promise<Response<boolean>>;
  topBar: () => Promise<
    Response<ItemList<{ id: string; name: string; baseDuration: number }>>
  >;
  professionals: Professional[];
  count: number;
};

type ProfessionalsProviderProps = {
  children: React.ReactElement;
};

const ProfessionalsContext = createContext<ProfessionalsContextData>(
  {} as ProfessionalsContextData
);

export const ProfessionalsProvider: React.FC<ProfessionalsProviderProps> = ({
  children,
}: ProfessionalsProviderProps) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [count, setCount] = useState<number>(0);

  const list = async ({
    size,
    page,
    filter,
  }: ListProps): Promise<Response<ItemList<Professional>>> => {
    const { data }: { data: Response<ItemList<Professional>> } = await api.post(
      page && size
        ? `professional/search?page=${page}&size=${size}`
        : 'professional/search',
      {
        ...filter,
      }
    );

    setProfessionals(data.content?.items as Professional[]);
    setCount(data.content?.totalItems || 0);

    return data;
  };

  const create = async (
    professional: FormProfessional
  ): Promise<Response<Professional>> => {
    const { data }: { data: Response<Professional> } = await api.post(
      'professional',
      {
        ...professional,
      }
    );

    return data;
  };

  const remove = async (professionalId: string): Promise<Response<boolean>> => {
    const { data }: { data: Response<boolean> } = await api.delete(
      `professional/${professionalId}`
    );

    return data;
  };

  const getProfile = async (): Promise<Response<Professional>> => {
    const { data }: { data: Response<Professional> } = await api.get(
      'professional/profile'
    );

    return data;
  };

  const updateProfile = async (
    professional: UpdateProfessional
  ): Promise<Response<Professional>> => {
    const { data }: { data: Response<Professional> } = await api.put(
      'professional',
      {
        ...professional,
      }
    );

    return data;
  };

  const getWeeklySchedule = async (): Promise<Response<WeeklySchedule[]>> => {
    const { data }: { data: Response<WeeklySchedule[]> } = await api.get(
      'weekly_schedule'
    );

    return data;
  };

  const updateWeeklySchedule = async (
    weeklySchedule: UpdateWeeklySchedule
  ): Promise<Response<WeeklySchedule>> => {
    const { data }: { data: Response<WeeklySchedule> } = await api.post(
      'weekly_schedule',
      {
        ...weeklySchedule,
      }
    );

    return data;
  };

  const deleteLock = async (
    weeklyId: string,
    lockId: string
  ): Promise<Response<boolean>> => {
    const { data }: { data: Response<boolean> } = await api.delete(
      `weekly_schedule/${weeklyId}/${lockId}`
    );

    return data;
  };

  const topBar = async (): Promise<
    Response<ItemList<{ id: string; name: string; baseDuration: number }>>
  > => {
    const {
      data,
    }: {
      data: Response<
        ItemList<{ id: string; name: string; baseDuration: number }>
      >;
    } = await api.get('professional/top_bar');

    setProfessionals(data.content?.items as Professional[]);
    setCount(data.content?.totalItems || 0);

    return data;
  };

  return (
    <ProfessionalsContext.Provider
      value={{
        list,
        create,
        remove,
        getProfile,
        updateProfile,
        getWeeklySchedule,
        updateWeeklySchedule,
        deleteLock,
        topBar,
        professionals,
        count,
      }}
    >
      {children}
    </ProfessionalsContext.Provider>
  );
};

export const useProfessionals = (): ProfessionalsContextData => {
  const context = useContext(ProfessionalsContext);

  if (!context) {
    throw new Error('Este hook deve ser utilizado dentro de seu provider');
  }

  return context;
};
