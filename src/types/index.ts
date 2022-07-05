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
