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
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isAuthenticated: boolean;
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

  const signIn = async (credentials: AuthCredentials): Promise<void> => {
    const { data }: { data: Response<LoginResponse> } = await api.post('auth', {
      ...credentials,
    });

    const decodedToken: User = decodeToken(
      data.content?.accessToken || ''
    ) as User;

    localStorage.setItem('@psis:accessToken', data.content?.accessToken || '');
    localStorage.setItem('@psis:userData', JSON.stringify(decodedToken));
    api.defaults.headers.common[
      'authorization'
    ] = `Bearer ${data.content?.accessToken}`;

    setUser(decodedToken);
  };

  const signOut = (): void => {
    setUser({} as User);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        setUser,
        isAuthenticated: Object.keys(user).length !== 0,
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
