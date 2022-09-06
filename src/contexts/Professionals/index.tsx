import React, { createContext, useContext, useState } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { SearchFilter } from '@interfaces/SearchFilter';
import { ItemList } from '@interfaces/ItemList';
import { FormProfessional, Professional } from '@models/Professional';

type ListProps = {
  page?: number;
  size?: number;
  filter?: SearchFilter;
};

type ProfessionalsContextData = {
  list: (listProps: ListProps) => Promise<void>;
  create: (professional: FormProfessional) => Promise<Response<Professional>>;
  remove: (professionalId: string) => Promise<Response<boolean>>;
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

  const list = async ({ size, page, filter }: ListProps): Promise<void> => {
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
  };

  const create = async (professional: FormProfessional): Promise<Response<Professional>> => {
    const { data }: { data: Response<Professional> } = await api.post('professional', {
      ...professional,
    });

    return data;
  };

  const remove = async (professionalId: string): Promise<Response<boolean>> => {
    const { data }: { data: Response<boolean> } = await api.delete(
      `professional/${professionalId}`
    );

    return data;
  };

  return (
    <ProfessionalsContext.Provider
      value={{
        list,
        create,
        remove,
        professionals,
        count,
      }}
    >
      {children}
    </ProfessionalsContext.Provider>
  );
};

export const usesProfessionals = (): ProfessionalsContextData => {
  const context = useContext(ProfessionalsContext);

  if (!context) {
    throw new Error('Este hook deve ser utilizado dentro de seu provider');
  }

  return context;
};
