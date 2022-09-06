import { FormPerson } from './Person';
import { User } from './User';

export type Professional = {
  profession: string;
  specialization?: string;
  baseDuration: number;
  registry: string;
} & User;


export type FormProfessional = {
  profession: string;
  specialization?: string;
  baseDuration: number;
  registry: string;
  password: string;
} & User & FormPerson;