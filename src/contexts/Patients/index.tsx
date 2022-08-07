import React, { createContext, useContext, useState } from 'react';
import { FormPatient, Patient } from '@models/Patient';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { SearchFilter } from '@interfaces/SearchFilter';
import { ItemList } from '@interfaces/ItemList';

type PatientsContextData = {
  list: (page?: number, size?: number, filter?: SearchFilter) => Promise<void>;
  create: (patient: FormPatient) => Promise<Response<Patient>>;
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

  const list = async (page?: number, size?: number): Promise<void> => {
    const { data }: { data: Response<ItemList<Patient>> } = await api.post(
      page && size
        ? `patient/search?page=${page}&size=${size}`
        : 'patient/search',
      {}
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

  return (
    <PatientsContext.Provider
      value={{
        list,
        create,
        patients,
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
