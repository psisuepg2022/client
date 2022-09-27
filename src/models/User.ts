import { Permissions } from '@interfaces/Permissions';
import { Clinic } from './Clinic';
import { Person } from './Person';

export type User = {
  accessCode: number;
  userName: string;
  name: string;
  email: string;
  permissions: Permissions;
  clinic?: Clinic;
  baseDuration?: number;
} & Person;
