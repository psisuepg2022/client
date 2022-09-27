import React, { createContext, useContext } from 'react';
import { Response } from '@interfaces/Response';
import { api } from '@service/index';
import { Owner, UpdateOwner } from '@models/Owner';

type OwnerContextData = {
  getProfile: () => Promise<Response<Owner>>;
  updateProfile: (owner: UpdateOwner) => Promise<Response<Owner>>;
};

type OwnerProviderProps = {
  children: React.ReactElement;
};

const OwnerContext = createContext<OwnerContextData>({} as OwnerContextData);

export const OwnerProvider: React.FC<OwnerProviderProps> = ({
  children,
}: OwnerProviderProps) => {
  const getProfile = async (): Promise<Response<Owner>> => {
    const { data }: { data: Response<Owner> } = await api.get('owner/profile');

    return data;
  };

  const updateProfile = async (
    owner: UpdateOwner
  ): Promise<Response<Owner>> => {
    const { data }: { data: Response<Owner> } = await api.put('owner', {
      ...owner,
    });

    return data;
  };

  return (
    <OwnerContext.Provider
      value={{
        getProfile,
        updateProfile,
      }}
    >
      {children}
    </OwnerContext.Provider>
  );
};

export const useOwner = (): OwnerContextData => {
  const context = useContext(OwnerContext);

  if (!context) {
    throw new Error('Este hook deve ser utilizado dentro de seu provider');
  }

  return context;
};
