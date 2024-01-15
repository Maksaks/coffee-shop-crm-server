export const getDayBefore = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

export const getWeekBefore = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

export const getMonthBefore = () => {
  const date = new Date();
  date.setDate(date.getMonth() - 1);
  return date;
};

export const getYearBefore = () => {
  const date = new Date();
  date.setDate(date.getFullYear() - 1);
  return date;
};

export const getTodayMidnight = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};
