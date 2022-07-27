import React from 'react';
import { SectionBar, SectionHeader, SectionTitle } from './styles';

type SectionDividerProps = {
  children?: React.ReactNode;
  fontSize?: number;
};

const SectionDivider: React.FC<SectionDividerProps> = ({
  children,
  fontSize,
}) => {
  return (
    <SectionHeader>
      <SectionTitle style={{ fontSize: fontSize }}>{children}</SectionTitle>
      <SectionBar />
    </SectionHeader>
  );
};

export default SectionDivider;
