import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import Datepicker from "./Datepicker";

const messages = defineMessages({
  birthdayPlaceholder: {
    id: "edit_profile.fields.birthday_placeholder",
    defaultMessage: "Your birthday",
  },
  previousMonth: {
    id: "datepicker.previous_month",
    defaultMessage: "Previous month",
  },
  nextMonth: { id: "datepicker.next_month", defaultMessage: "Next month" },
  previousYear: {
    id: "datepicker.previous_year",
    defaultMessage: "Previous year",
  },
  nextYear: { id: "datepicker.next_year", defaultMessage: "Next year" },
});

interface IBirthdayInput {
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const BirthdayInput: React.FC<IBirthdayInput> = ({
  value,
  onChange,
  required,
}) => {
  const intl = useIntl();

  // Convert existing ISO date string to local Date
  const selected = useMemo(() => {
    if (!value) return;
    const date = new Date(value);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }, [value]);

  // When a new Date is chosen, convert back to YYYY-MM-DD
  const handleChange = (date: Date) => {
    if (!date) {
      onChange("");
      return;
    }
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    onChange(offsetDate.toISOString().slice(0, 10));
  };

  return (
    <div className="relative mt-1 rounded-md shadow-sm">
      {/* If you want a label or placeholder, place it near the date dropdowns or text above them */}
      <Datepicker
        value={selected}
        onChange={handleChange}
        min={new Date("1900-01-01")}
      />
    </div>
  );
};

export default BirthdayInput;
