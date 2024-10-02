export const getAllMondays = (year: number): Date[] => {
  const date = new Date(year, 0, 1); // January 1st
  const mondays: Date[] = [];

  // Find the first Monday of the year
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }

  // Add all Mondays to the list
  while (date.getFullYear() === year) {
    mondays.push(new Date(date));
    date.setDate(date.getDate() + 7);
  }

  return mondays;
};
