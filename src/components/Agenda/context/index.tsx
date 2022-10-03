import React, { createContext, useContext, useState } from 'react';

type AgendaContextData = {};

type AgendaProviderProps = {
  children: React.ReactElement;
};

const AgendaContext = createContext<AgendaContextData>({} as AgendaContextData);

export const AgendaProvider: React.FC<AgendaProviderProps> = ({
  children,
}: AgendaProviderProps) => {
  return <AgendaContext.Provider value={{}}>{children}</AgendaContext.Provider>;
};

export const useAgenda = (): AgendaContextData => {
  const context = useContext(AgendaContext);

  if (!context) {
    throw new Error('Este hook deve ser utilizado dentro de seu provider');
  }

  return context;
};
