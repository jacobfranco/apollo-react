import { z } from "zod";

export const dateStringOrNumber = z.union([z.string(), z.number()]).nullable();

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

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

export function formatShortDate(dateInput: string | number | Date): string {
  let date: Date;

  if (typeof dateInput === "number") {
    // Check if the timestamp is in seconds (less than 1e12)
    if (dateInput < 1e12) {
      date = new Date(dateInput * 1000);
    } else {
      date = new Date(dateInput);
    }
  } else if (typeof dateInput === "string") {
    date = new Date(
      Number(dateInput) < 1e12 ? Number(dateInput) * 1000 : dateInput
    );
  } else {
    date = new Date(dateInput);
  }

  const month = date.getMonth() + 1; // months are zero-indexed
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2); // get last two digits

  return `${month.toString().padStart(2, "0")}/${day
    .toString()
    .padStart(2, "0")}/${year}`;
}
