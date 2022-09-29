export type Column = {
  id: number;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
  tooltip?: React.ReactElement;
};
