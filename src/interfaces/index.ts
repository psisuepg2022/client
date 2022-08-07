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

export type FormPerson = {
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
  address?: Address;
} & Person;

export type FormPatient = {
  maritalStatus: number;
  gender: number;
  liable?: FormPerson | { id: string };
  liableRequired?: boolean;
  address?: Address;
} & FormPerson;

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
  'Transgênero',
  'Não-binário',
  'Prefiro não dizer',
}

export type User = {
  id: string;
  accessCode: number;
  userName: string;
  name: string;
  email: string;
  permissions: string[];
  clinic: {
    id: string;
    name: string;
  };
};
