export const getHourDifference = (startDate, endDate) => {
  const timeDifference = Math.abs(startDate.getTime() - endDate.getTime());
  const hourDifference = timeDifference / (1000 * 60 * 60);
  const roundedDownDifference = Math.floor(hourDifference);
  return roundedDownDifference;
};
