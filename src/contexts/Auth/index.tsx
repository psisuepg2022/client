import React, { createContext, useContext, useState } from 'react';
import { decodeToken } from 'react-jwt';
import { Response } from '@interfaces/Response';
import { User } from '@models/User';
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
  signIn: (credentials: AuthCredentials) => Promise<User>;
  signOut: () => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  changePassword: (
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) => Promise<Response<boolean>>;
  isAuthenticated: boolean;
  sideBarExpanded: boolean;
  setSideBarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

type AuthProviderProps = {
  children: React.ReactElement;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User>(() => {
    const storageAccessToken = localStorage.getItem('@psis:accessToken');
    const storageUserData = localStorage.getItem('@psis:userData');

    if (storageAccessToken && storageUserData) {
      api.defaults.headers.common[
        'authorization'
      ] = `Bearer ${storageAccessToken}`;

      const decodedUser: User = JSON.parse(storageUserData) as User;
      return decodedUser;
    }
    return {} as User;
  });
  const [sideBarExpanded, setSideBarExpanded] = useState<boolean>(true);

  const signIn = async (credentials: AuthCredentials): Promise<User> => {
    const { data }: { data: Response<LoginResponse> } = await api.post('auth', {
      ...credentials,
    });

    const decodedToken: User = decodeToken(
      data.content?.accessToken || ''
    ) as User;

    localStorage.setItem('@psis:accessToken', data.content?.accessToken || '');
    localStorage.setItem(
      '@psis:refreshToken',
      data.content?.refreshToken || ''
    );
    localStorage.setItem('@psis:userData', JSON.stringify(decodedToken));
    api.defaults.headers.common[
      'authorization'
    ] = `Bearer ${data.content?.accessToken}`;

    setUser(decodedToken);
    return decodedToken;
  };

  const signOut = (): void => {
    setUser({} as User);
    localStorage.clear();
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<Response<boolean>> => {
    const { data }: { data: Response<boolean> } = await api.post(
      'auth/reset_password',
      {
        oldPassword,
        newPassword,
        confirmNewPassword,
      }
    );

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        setUser,
        changePassword,
        isAuthenticated: Object.keys(user).length !== 0,
        sideBarExpanded,
        setSideBarExpanded,
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
