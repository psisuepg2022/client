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
  zip_code: string;
  public_area: string;
  district: string;
};

export type Person = {
  id: string;
  name: string;
  email?: string;
  contact_number?: string;
  CPF?: string;
  birth_date: string;
};

export type Patient = {
  marital_status: string;
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
  complemento: string;
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
