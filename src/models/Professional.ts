import { Address, FormAddress } from './Address';
import { FormPerson } from './Person';
import { User } from './User';

export type Professional = {
  profession: string;
  specialization?: string;
  baseDuration: number;
  registry: string;
  address?: Address;
} & User;

export type FormProfessional = {
  profession: string;
  specialization?: string;
  baseDuration: number;
  registry: string;
  password: string;
  address?: Address;
} & User &
  FormPerson;

export type UpdateProfessional = Omit<
  User,
  'accessCode' | 'userName' | 'permissions' | 'id' | 'email'
> & {
  profession: string;
  specialization?: string;
  registry: string;
  address?: FormAddress;
  email?: string;
} & FormPerson;
