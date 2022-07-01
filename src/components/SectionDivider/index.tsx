import React from 'react';
import { SectionBar, SectionHeader, SectionTitle } from './styles';

type SectionDividerProps = {
  children?: React.ReactNode;
};

const SectionDivider: React.FC<SectionDividerProps> = ({ children }) => {
  return (
    <SectionHeader>
      <SectionTitle>{children}</SectionTitle>
      <SectionBar />
    </SectionHeader>
  );
};

export default SectionDivider;
