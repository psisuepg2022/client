import { Response } from '@interfaces/Response';
import axios from 'axios';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/`,
  //baseURL: 'http://localhost:3333/api/',
});

const getLocalAccessToken = (): string => {
  const accessToken = window.localStorage.getItem('@psis:accessToken');
  return accessToken as string;
};

const getLocalRefreshToken = (): string => {
  const refreshToken = window.localStorage.getItem('@psis:refreshToken');
  return refreshToken as string;
};

const getNewTokens = async (): Promise<
  Response<{ accessToken: string; refreshToken: string }>
> => {
  const {
    data,
  }: { data: Response<{ accessToken: string; refreshToken: string }> } =
    await api.post('/auth/refresh', {
      refreshToken: getLocalRefreshToken(),
    });

  return data;
};

api.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      api.defaults.headers.common['authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const newTokens = await getNewTokens();
          const { content } = newTokens;
          localStorage.setItem('@psis:accessToken', content?.accessToken || '');
          localStorage.setItem(
            '@psis:refreshToken',
            content?.refreshToken || ''
          );
          api.defaults.headers.common[
            'authorization'
          ] = `Bearer ${content?.accessToken}`;

          const originalWithNewToken = {
            ...originalConfig,
            headers: { authorization: `Bearer ${content?.accessToken}` },
          };

          return api(originalWithNewToken);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (_error: any) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }

          return Promise.reject(_error);
        }
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }

    return Promise.reject(err);
  }
);
