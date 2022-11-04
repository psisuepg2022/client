import React, { createContext, useContext, useState } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { SearchFilter } from '@interfaces/SearchFilter';
import { ItemList } from '@interfaces/ItemList';
import {
  ConfigureProfessional,
  FormProfessional,
  Professional,
  UpdateProfessional,
} from '@models/Professional';
import { UpdateWeeklySchedule, WeeklySchedule } from '@models/WeeklySchedule';
import { User } from '@models/User';
import decode from 'jwt-decode';
import { DeleteProfessionalWithAppointments } from '@interfaces/DeleteProfessionalWithAppointments';

type ListProps = {
  page?: number;
  size?: number;
  filter?: SearchFilter;
};

type ConfigureResponse = {
  accessToken: string;
  refreshToken: string;
};

type ConfigureReturn = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

type ProfessionalsContextData = {
  list: (listProps: ListProps) => Promise<Response<ItemList<Professional>>>;
  create: (professional: FormProfessional) => Promise<Response<Professional>>;
  remove: (
    professionalId: string
  ) => Promise<Response<DeleteProfessionalWithAppointments>>;
  getProfile: () => Promise<Response<Professional>>;
  updateProfile: (
    professional: UpdateProfessional
  ) => Promise<Response<Professional>>;
  getWeeklySchedule: () => Promise<Response<WeeklySchedule[]>>;
  updateWeeklySchedule: (
    weeklySchedule: UpdateWeeklySchedule
  ) => Promise<Response<WeeklySchedule | boolean>>;
  configure: (configs: ConfigureProfessional) => Promise<ConfigureReturn>;
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
      (page as number) >= 0 && size
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

  const remove = async (
    professionalId: string
  ): Promise<Response<DeleteProfessionalWithAppointments>> => {
    const { data }: { data: Response<DeleteProfessionalWithAppointments> } =
      await api.delete(`professional/${professionalId}`);

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
  ): Promise<Response<WeeklySchedule | boolean>> => {
    const { data }: { data: Response<WeeklySchedule | boolean> } =
      await api.post('weekly_schedule', {
        ...weeklySchedule,
      });

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

  const configure = async (
    configs: ConfigureProfessional
  ): Promise<ConfigureReturn> => {
    const { data }: { data: Response<ConfigureResponse> } = await api.post(
      'professional/configure',
      {
        ...configs,
      }
    );

    const decodedToken: User = decode(data.content?.accessToken || '') as User;

    return {
      accessToken: data.content?.accessToken as string,
      refreshToken: data.content?.refreshToken as string,
      user: decodedToken,
    };
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
        configure,
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
