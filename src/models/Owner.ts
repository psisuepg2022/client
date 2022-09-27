import { Address } from './Address';
import { User } from './User';

export type Owner = User & {
  address?: Address;
};

export type UpdateOwner = Omit<
  Owner,
  'accessCode' | 'userName' | 'permissions' | 'id' | 'email' | 'clinic'
> & {
  email?: string;
  clinic?: {
    email?: string;
    name: string;
    id: string;
  };
};
