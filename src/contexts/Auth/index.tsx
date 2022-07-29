import React, { createContext, useCallback, useContext, useState } from 'react';
import { Response } from '../../interfaces';
import { api } from '../../service';

type AuthCredentials = {
  access_code: number;
  user_name: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextData = {
  signIn: (credentials: AuthCredentials) => Promise<Response<LoginResponse>>;
};

type AuthProviderProps = {
  children: React.ReactElement;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const signIn = (
    credentials: AuthCredentials
  ): Promise<Response<LoginResponse>> => {};

  return (
    <AuthContext.Provider
      value={{
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Este hook deve ser utilizado dentro de seu provider');
  }

  return context;
};
