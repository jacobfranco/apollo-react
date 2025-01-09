import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Select from "./Select";
import Stack from "./Stack";
import Text from "./Text";

interface IDatepicker {
  value?: Date;
  onChange(date: Date): void;
  min?: Date;
  max?: Date;
  required?: boolean;
  "aria-label"?: string; // Optional placeholder/ARIA label
}

// Utility: total days in a given month/year
const getDaysInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

/** Clamps date between min and max if either boundary is provided. */
function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && date < min) return min;
  return date;
}

/**
 * Datepicker: Select month, day, year via dropdowns.
 */
const Datepicker = ({ value, onChange, min, max, ...rest }: IDatepicker) => {
  const intl = useIntl();

  const defaultDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 16);
    return date;
  }, []);

  const date = value ?? defaultDate;
  const actualMin = min ?? defaultDate;

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Each dropdown change => create a new Date => call onChange
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(year, Number(e.target.value), day);
    onChange(clampDate(newDate, actualMin, max));
  };

  // Update other handlers similarly
  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(year, month, Number(e.target.value));
    onChange(clampDate(newDate, actualMin, max));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(Number(e.target.value), month, day);
    onChange(clampDate(newDate, actualMin, max));
  };

  const numberOfDays = getDaysInMonth(month, year);

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" {...rest}>
      <div>
        <FormattedMessage id="datepicker.month" defaultMessage="Month" />
        <Select value={month} onChange={handleMonthChange}>
          {[...Array(12)].map((_, idx) => (
            <option key={idx} value={idx}>
              {intl.formatDate(new Date(year, idx, 1), { month: "short" })}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <FormattedMessage id="datepicker.day" defaultMessage="Day" />
        <Select value={day} onChange={handleDayChange}>
          {[...Array(numberOfDays)].map((_, idx) => (
            <option key={idx} value={idx + 1}>
              {idx + 1}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <FormattedMessage id="datepicker.year" defaultMessage="Year" />
        <Select value={year} onChange={handleYearChange}>
          {/*
            For example, let’s just do 1900..currentYear
          */}
          {Array.from(
            { length: new Date().getFullYear() - 1900 + 1 },
            (_, i) => {
              const thisYear = 1900 + i;
              return (
                <option key={thisYear} value={thisYear}>
                  {thisYear}
                </option>
              );
            }
          )}
        </Select>
      </div>
    </div>
  );
};

export default Datepicker;
