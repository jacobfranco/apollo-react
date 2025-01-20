import React, { useState, useMemo, useEffect, useRef } from "react";
import chevronLeftIcon from "@tabler/icons/outline/chevron-left.svg";
import chevronRightIcon from "@tabler/icons/outline/chevron-right.svg";
import Icon from "./Icon";
import { format } from "date-fns";
import { getAllMondays } from "src/utils/dates";

interface WeekPickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const ArrowButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode }
> = ({ icon, disabled, ...props }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex items-center justify-center rounded-full p-2 transition-colors duration-200
        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "text-gray-700 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800"
        }`}
      {...props}
    >
      {icon}
    </button>
  );
};

const RangeButton: React.FC<{
  startDate: string;
  startYear: string;
  endDate: string;
  endYear: string;
  onClick: () => void;
  isOpen: boolean;
}> = ({ startDate, startYear, endDate, endYear, onClick, isOpen }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      className={`flex flex-col items-center rounded-lg px-4 py-2 transition-all duration-200
        border border-gray-300 dark:border-primary-700
        hover:border-primary-400 dark:hover:border-primary-600
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900
        ${
          isOpen
            ? "bg-primary-200 dark:bg-secondary-800"
            : "bg-primary-200 dark:bg-secondary-900"
        }`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {startDate}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {startYear}
          </span>
        </div>
        <span className="text-gray-400 dark:text-gray-500">-</span>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {endDate}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {endYear}
          </span>
        </div>
      </div>
    </button>
  );
};

const WeekPicker: React.FC<WeekPickerProps> = ({ selectedDate, onChange }) => {
  const allMondays = useMemo(() => getAllMondays(2025), []);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Ensure the selectedDate is always a Monday with time set to midnight
  useEffect(() => {
    const day = selectedDate.getDay();
    if (day !== 1) {
      const diff = day === 0 ? -6 : 1 - day;
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + diff);
      newDate.setHours(0, 0, 0, 0);
      onChange(newDate);
    }
  }, [selectedDate, onChange]);

  const handlePreviousWeek = () => {
    const currentIndex = allMondays.findIndex(
      (date) => date.getTime() === selectedDate.getTime()
    );
    if (currentIndex > 0) {
      onChange(allMondays[currentIndex - 1]);
    }
  };

  const handleNextWeek = () => {
    const currentIndex = allMondays.findIndex(
      (date) => date.getTime() === selectedDate.getTime()
    );
    if (currentIndex < allMondays.length - 1) {
      onChange(allMondays[currentIndex + 1]);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectWeek = (date: Date) => {
    const alignedDate = new Date(date);
    alignedDate.setHours(0, 0, 0, 0);
    onChange(alignedDate);
    setIsOpen(false);
  };

  const formattedSelectedDate = useMemo(() => {
    const startDate = format(selectedDate, "MMM d");
    const endDate = format(
      new Date(selectedDate.getTime() + 6 * 24 * 60 * 60 * 1000),
      "MMM d"
    );
    const year = format(selectedDate, "yyyy");
    return { startDate, endDate, year };
  }, [selectedDate]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        <ArrowButton
          icon={<Icon src={chevronLeftIcon} className="h-5 w-5" />}
          onClick={handlePreviousWeek}
          disabled={selectedDate <= allMondays[0]}
          aria-label="Previous Week"
        />

        <RangeButton
          startDate={formattedSelectedDate.startDate}
          startYear={formattedSelectedDate.year}
          endDate={formattedSelectedDate.endDate}
          endYear={formattedSelectedDate.year}
          onClick={toggleDropdown}
          isOpen={isOpen}
        />

        <ArrowButton
          icon={<Icon src={chevronRightIcon} className="h-5 w-5" />}
          onClick={handleNextWeek}
          disabled={selectedDate >= allMondays[allMondays.length - 1]}
          aria-label="Next Week"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto rounded-lg border border-gray-300 bg-primary-200 shadow-lg dark:border-secondary-700 dark:bg-secondary-900 z-50">
          <ul className="py-1" role="listbox">
            {allMondays.map((date) => {
              const endOfWeek = new Date(date);
              endOfWeek.setDate(date.getDate() + 6);
              const isSelected = date.getTime() === selectedDate.getTime();
              const weekStart = format(date, "MMM d");
              const weekEnd = format(endOfWeek, "MMM d");
              const weekYear = format(date, "yyyy");

              return (
                <li
                  key={date.toISOString()}
                  onClick={() => selectWeek(date)}
                  className={`cursor-pointer px-4 py-2 transition-colors duration-200
                    ${
                      isSelected
                        ? "bg-gray-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300"
                        : "hover:bg-primary-100 dark:hover:bg-gray-800"
                    }`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      selectWeek(date);
                    }
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-medium">{`${weekStart} - ${weekEnd}`}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeekPicker;
