import React, { createContext, useContext, useState } from 'react';
import { decodeToken } from 'react-jwt';
import { Response, User } from '../../interfaces';
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
  user: User;
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

    if (storageAccessToken) {
      api.defaults.headers.common[
        'authorization'
      ] = `Bearer ${storageAccessToken}`;

      const decodedUser: User = decodeToken(storageAccessToken) as User;
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

    setUser(decodedToken);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        user,
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
