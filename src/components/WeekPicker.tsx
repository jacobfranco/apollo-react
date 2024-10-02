import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getAllMondays } from 'src/utils/weeks';
import { format } from 'date-fns';
import IconButton from './IconButton';

interface WeekPickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const WeekPicker: React.FC<WeekPickerProps> = ({ selectedDate, onChange }) => {
  const allMondays = useMemo(() => getAllMondays(2024), []);
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    const endOfWeek = new Date(selectedDate);
    endOfWeek.setDate(selectedDate.getDate() + 6);
    return `${format(selectedDate, 'MMM d, yyyy')} - ${format(endOfWeek, 'MMM d, yyyy')}`;
  }, [selectedDate]);

  return (
    <div className="week-picker" ref={dropdownRef}>
      <div className="week-picker__controls">
        {/* Previous Week Button */}
        <IconButton
          onClick={handlePreviousWeek}
          disabled={selectedDate <= allMondays[0]}
          src={require('@tabler/icons/outline/chevron-left.svg')}
          theme="outlined" // Choose appropriate theme
          aria-label="Previous Week"
          iconClassName="h-5 w-5" // Adjust icon size as needed
        />

        {/* Dropdown Toggle Button */}
        <IconButton
          onClick={toggleDropdown}
          src={require('@tabler/icons/outline/calendar.svg')}
          text={formattedSelectedDate}
          theme="outlined" // Choose appropriate theme
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          iconClassName="h-5 w-5 mr-2" // Adjust icon size and spacing
        />

        {/* Next Week Button */}
        <IconButton
          onClick={handleNextWeek}
          disabled={selectedDate >= allMondays[allMondays.length - 1]}
          src={require('@tabler/icons/outline/chevron-right.svg')}
          theme="outlined" // Choose appropriate theme
          aria-label="Next Week"
          iconClassName="h-5 w-5" // Adjust icon size as needed
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
              return (
                <li
                  key={date.toISOString()}
                  onClick={() => selectWeek(date)}
                  className={`week-picker__item ${isSelected ? 'week-picker__item--selected' : ''}`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      selectWeek(date);
                    }
                  }}
                >
                  {`${format(date, 'MMM d, yyyy')} - ${format(endOfWeek, 'MMM d, yyyy')}`}
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
