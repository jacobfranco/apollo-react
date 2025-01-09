import React, { useState, useMemo, useEffect, useRef } from "react";
import chevronLeftIcon from "@tabler/icons/outline/chevron-left.svg";
import chevronRightIcon from "@tabler/icons/outline/chevron-right.svg";
import { getAllMondays } from "src/utils/dates";
import { format } from "date-fns";
import ArrowButton from "./ArrowButton";
import RangeIconButton from "./RangeIconButton";

interface WeekPickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

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
    <div className="week-picker" ref={dropdownRef}>
      <div className="week-picker__controls">
        {/* Previous Week Button */}
        <ArrowButton
          onClick={handlePreviousWeek}
          disabled={selectedDate <= allMondays[0]}
          src={chevronLeftIcon}
          ariaLabel="Previous Week"
        />

        {/* Dropdown Toggle Button */}
        <RangeIconButton
          onClick={toggleDropdown}
          // Removed src prop as icon is no longer needed
          startDate={formattedSelectedDate.startDate}
          startYear={formattedSelectedDate.year}
          endDate={formattedSelectedDate.endDate}
          endYear={formattedSelectedDate.year}
          theme="outlined" // You can keep this or change based on design
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        />

        {/* Next Week Button */}
        <ArrowButton
          onClick={handleNextWeek}
          disabled={selectedDate >= allMondays[allMondays.length - 1]}
          src={chevronRightIcon}
          ariaLabel="Next Week"
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="week-picker__dropdown" role="listbox">
          <ul className="week-picker__list">
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
                  className={`week-picker__item ${
                    isSelected ? "week-picker__item--selected" : ""
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
                  <div className="week-picker__item-content">
                    <span className="week-picker__item-date">{`${weekStart} - ${weekEnd}`}</span>
                    <span className="week-picker__item-year">{weekYear}</span>
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
