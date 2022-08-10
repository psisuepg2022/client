import { User } from './User';

export type ProfessionalModel = {
  profession: string;
  specialization?: string;
  baseDuration: number;
  registry: string;
} & User;
