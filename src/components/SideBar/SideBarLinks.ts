import { Person } from '@mui/icons-material';
import React from 'react';

type SideBarLinks = {
  title: string;
  path: string;
  icon: React.ReactElement;
};

export const sideBarLinks = [
  {
    title: 'Agenda',
    path: '/agenda',
    icon: Person,
  },
  {
    title: 'Profissionais',
    path: '/professionals',
    icon: Person,
  },
  {
    title: 'Colaboradores',
    path: '/collaborators',
    icon: Person,
  },
  {
    title: 'Pacientes',
    path: '/patients',
    icon: Person,
  },
];
