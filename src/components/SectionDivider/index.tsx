import React from 'react';
import { SectionBar, SectionHeader, SectionTitle } from './styles';

type SectionDividerProps = {
  children?: React.ReactNode;
  fontSize?: number;
  help?: React.ReactElement;
};

const SectionDivider: React.FC<SectionDividerProps> = ({
  children,
  fontSize,
  help,
}) => {
  return (
    <SectionHeader>
      <SectionTitle style={{ fontSize: fontSize }}>{children}</SectionTitle>
      {help && help}
      <SectionBar />
    </SectionHeader>
  );
};

export default SectionDivider;
