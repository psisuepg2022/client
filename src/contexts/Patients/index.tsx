import React, { createContext, useContext, useState } from 'react';
import { Patient, Response } from '../../interfaces';
import { api } from '../../service';

type PatientsList = {
  items: Patient[];
  totalItems: number;
};

type PatientsContextData = {
  list: (page?: number, size?: number) => Promise<void>;
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
    const { data }: { data: Response<PatientsList> } = await api.get(
      page && size ? `/patient?page=${page}&size=${size}` : '/patient'
    );

    setPatients((prev) => [...prev, ...(data.content?.items as Patient[])]);
    setCount(data.content?.totalItems || 0);
  };

  return (
    <PatientsContext.Provider
      value={{
        patients,
        list,
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
