import { api } from '@service/index';
import { CepInfos } from '@interfaces/CepInfos';

export const searchForCep = async (value: string): Promise<CepInfos | void> => {
  const treatedCep = value.replace(/\D/g, '');
  const { data } = await api.get(`https://viacep.com.br/ws/${treatedCep}/json`);

  if (data.erro) {
    throw new Error('CEP inválido');
  }

  return data as CepInfos;
};
