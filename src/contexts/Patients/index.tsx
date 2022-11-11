import React, { createContext, useContext, useState } from 'react';
import { FormPatient, Patient } from '@models/Patient';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { ItemList } from '@interfaces/ItemList';

type ListProps = {
  page?: number;
  size?: number;
  composed?: string;
};

type PatientsContextData = {
  list: (listProps: ListProps) => Promise<void>;
  create: (patient: FormPatient) => Promise<Response<Patient>>;
  remove: (patientId: string) => Promise<Response<boolean>>;
  professionalPatients: (
    listProps: ListProps
  ) => Promise<Response<ItemList<Patient>>>;
  patients: Patient[];
  count: number;
};

type PatientsProviderProps = {
  children: React.ReactElement;
};

const PatientsContext = createContext<PatientsContextData>(
  {} as PatientsContextData
);

export const PatientsProvider: React.FC<PatientsProviderProps> = ({
  children,
}: PatientsProviderProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [count, setCount] = useState<number>(0);

  const list = async ({ size, page, composed }: ListProps): Promise<void> => {
    const { data }: { data: Response<ItemList<Patient>> } = await api.post(
      (page as number) >= 0 && size
        ? `patient/search?page=${page}&size=${size}`
        : 'patient/search',
      {
        composed,
      }
    );

    setPatients(data.content?.items as Patient[]);
    setCount(data.content?.totalItems || 0);
  };

  const create = async (patient: FormPatient): Promise<Response<Patient>> => {
    const { data }: { data: Response<Patient> } = await api.post('patient', {
      ...patient,
    });

    return data;
  };

  const remove = async (patientId: string): Promise<Response<boolean>> => {
    const { data }: { data: Response<boolean> } = await api.delete(
      `patient/${patientId}`
    );

    return data;
  };

  const professionalPatients = async ({
    size,
    page,
    composed,
  }: ListProps): Promise<Response<ItemList<Patient>>> => {
    const { data }: { data: Response<ItemList<Patient>> } = await api.post(
      page && size
        ? `professional/my_patients?page=${page}&size=${size}`
        : 'professional/my_patients',
      {
        composed,
      }
    );

    setPatients(data.content?.items as Patient[]);
    setCount(data.content?.totalItems || 0);

    return data;
  };

  return (
    <PatientsContext.Provider
      value={{
        list,
        create,
        remove,
        patients,
        professionalPatients,
        count,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = (): PatientsContextData => {
  const context = useContext(PatientsContext);

  if (!context) {
    throw new Error('Este hook deve ser utilizado dentro de seu provider');
  }

  return context;
};
