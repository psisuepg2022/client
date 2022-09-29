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

export type FormProfessional = Omit<
  User,
  'accessCode' | 'permissions' | 'id'
> & {
  profession: string;
  specialization?: string;
  registry: string;
  password: string;
  address?: FormAddress;
} & FormPerson;

export type UpdateProfessional = Omit<
  User,
  'accessCode' | 'permissions' | 'id'
> & {
  profession: string;
  specialization?: string;
  registry: string;
  address?: FormAddress;
} & FormPerson;
