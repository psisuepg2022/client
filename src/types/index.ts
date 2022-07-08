export type AgendaHours = {
  id: number;
  dayOfTheWeek: number;
  start: string;
  end: string;
  restrictions: [
    {
      id: number;
      start: string;
      end: string;
    }
  ];
};

export type Patient = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  CPF: string;
  birthdate: string;
  maritalStatus: number;
  sex: string;
};

export type Column = {
  id:
    | 'id'
    | 'name'
    | 'email'
    | 'phone'
    | 'CPF'
    | 'birthdate'
    | 'maritalStatus'
    | 'sex';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
};
