import React from 'react';
import { AiOutlineSchedule } from 'react-icons/ai';
import { MdOutlineSick } from 'react-icons/md';
import { FaHandHoldingMedical } from 'react-icons/fa';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { Permissions } from '@interfaces/Permissions';

export type SideBarLinks = {
  title: string;
  path: string;
  icon: React.ReactElement;
  requiredPermissions: Permissions[];
};

export const sideBarLinks: SideBarLinks[] = [
  {
    title: 'Agenda',
    path: '/schedule',
    icon: <AiOutlineSchedule color="#FFF" fontSize={30} />,
    requiredPermissions: ['USER_TYPE_PROFESSIONAL', 'READ_APPOINTMENTS'],
  },
  {
    title: 'Profissionais',
    path: '/professionals',
    icon: <FaHandHoldingMedical color="#FFF" fontSize={30} />,
    requiredPermissions: [
      'READ_PROFESSIONAL',
      // 'CREATE_PROFESSIONAL',
      // 'UPDATE_PROFESSIONAL', UPDATE AND DELETE WILL BE HANDLED AT THE ACCESS ICON ON TABLE
      // 'DELETE_PROFESSIONAL',
    ],
  },
  {
    title: 'Funcionários',
    path: '/employees',
    icon: <BsFillPersonLinesFill color="#FFF" fontSize={30} />,
    requiredPermissions: [
      'READ_EMPLOYEE',
      // 'CREATE_EMPLOYEE',
      // 'UPDATE_EMPLOYEE',
      // 'DELETE_EMPLOYEE',
    ],
  },
  {
    title: 'Pacientes',
    path: '/patients',
    icon: <MdOutlineSick color="#FFF" fontSize={28} />,
    requiredPermissions: [
      'READ_PATIENT',
      // 'CREATE_PATIENT',
      // 'UPDATE_PATIENT',
      // 'DELETE_PATIENT',
      'READ_LIABLE',
    ],
  },
];
