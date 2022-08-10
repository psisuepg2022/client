import { Address, FormAddress } from './Address';
import { Liable } from './Liable';
import { FormPerson, Person } from './Person';

export type Patient = {
  maritalStatus: string;
  gender: string;
  liable?: Liable;
  address?: Address;
} & Person;

export type FormPatient = {
  maritalStatus: number;
  gender: number;
  liable?: FormPerson | { id: string };
  liableRequired?: boolean;
  address?: FormAddress;
} & FormPerson;
