import { Address } from './Address';
import { FormPerson, Person } from './Person';

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
