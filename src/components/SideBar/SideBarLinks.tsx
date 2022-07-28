import React from 'react';
import { AiOutlineSchedule } from 'react-icons/ai';
import { MdOutlineSick } from 'react-icons/md';
import { FaHandHoldingMedical } from 'react-icons/fa';
import { BsFillPersonLinesFill } from 'react-icons/bs';

type SideBarLinks = {
  title: string;
  path: string;
  icon: React.ReactElement;
};

export const sideBarLinks: SideBarLinks[] = [
  {
    title: 'Agenda',
    path: '/agenda',
    icon: <AiOutlineSchedule color="#FFF" fontSize={30} />,
  },
  {
    title: 'Profissionais',
    path: '/professionals',
    icon: <FaHandHoldingMedical color="#FFF" fontSize={30} />,
  },
  {
    title: 'Colaboradores',
    path: '/collaborators',
    icon: <BsFillPersonLinesFill color="#FFF" fontSize={30} />,
  },
  {
    title: 'Pacientes',
    path: '/patients',
    icon: <MdOutlineSick color="#FFF" fontSize={28} />,
  },
];
