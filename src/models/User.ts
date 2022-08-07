import { Clinic } from './Clinic';

export type User = {
  id: string;
  accessCode: number;
  userName: string;
  name: string;
  email: string;
  permissions: string[];
  clinic?: Clinic;
};
