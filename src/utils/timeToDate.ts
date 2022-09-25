export const timeToDate = (time: string): Date => {
  const [hour, minute] = time.split(':');
  const currentDate = new Date();
  currentDate.setHours(Number(hour), Number(minute), 0);

  return currentDate;
};
