import { api } from '../service';
import { CepInfos } from '../interfaces';

export const searchForCep = async (value: string): Promise<CepInfos | void> => {
  try {
    const treatedCep = value.replace(/\D/g, '');
    const { data } = await api.get(
      `https://viacep.com.br/ws/${treatedCep}/json`
    );

    if (data.erro) {
      throw new Error('CEP inválido');
    }

    return data as CepInfos;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log('err', err);
  }
};
