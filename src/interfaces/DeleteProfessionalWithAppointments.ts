import { Person } from '@models/Person';

export type DeleteProfessionalWithAppointments = {
  header: string;
  patientsToCall: Partial<Person>[];
};
