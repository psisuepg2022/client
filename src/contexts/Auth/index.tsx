import React, { createContext, useContext } from 'react';
import { decodeToken } from 'react-jwt';
import { Response } from '../../interfaces';
import { api } from '../../service';

type AuthCredentials = {
  accessCode: number;
  userName: string;
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
  const signIn = async (
    credentials: AuthCredentials
  ): Promise<Response<LoginResponse>> => {
    const { data }: { data: Response<LoginResponse> } = await api.post('auth', {
      ...credentials,
    });

    const decodedToken = decodeToken(data.content?.accessToken || '');

    console.log('DECODED', decodedToken);

    return data;
  };

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
