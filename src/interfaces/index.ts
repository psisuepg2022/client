export type AgendaHours = {
  id: number;
  dayOfTheWeek: number;
  start: string;
  end: string;
  restrictions: [
    {
      id: number;
      start: string;
      end: string;
    }
  ];
};

export type Address = {
  city: string;
  state: string;
  zipCode: string;
  publicArea: string;
  district: string;
};

export type Person = {
  id: string;
  name: string;
  email?: string;
  contactNumber?: string;
  CPF?: string;
  birthDate: string;
};

export type Patient = {
  maritalStatus: string;
  gender: string;
  liable?: Person;
  address: Address;
} & Person;

export type Column = {
  id: number;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
  tooltip?: React.ReactElement;
};

export type CepInfos = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type InputErrorProps = {
  message: string;
  value: boolean;
};

export interface Response<T> {
  success: boolean;
  message: string;
  content: T | null;
}

export enum MartitalStatus {
  'Casado(a)' = 1,
  'Solteiro(a)',
  'Divorciado(a)',
  'Viúvo(a)',
}

export enum Gender {
  'Masculino' = 1,
  'Feminino',
  'Não-binário',
  'Prefiro não dizer',
}
