import { Address, FormAddress } from './Address';
import { FormPerson } from './Person';
import { User } from './User';

export type Employee = User & {
  address?: Address;
};

export type FormEmployee = Omit<
  User,
  'id' | 'baseDuration' | 'permissions' | 'accessCode'
> & {
  address?: FormAddress;
  password: string;
} & FormPerson;

export type UpdateEmployee = Omit<
  User,
  'accessCode' | 'permissions' | 'id' | 'baseDuration' | 'clinic'
> & {
  address?: Address;
};
