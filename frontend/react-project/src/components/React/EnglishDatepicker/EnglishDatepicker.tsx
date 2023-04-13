import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./EnglishDatepicker.scss";

interface DateProps {
  id?: string;
  name?: string;
  className?: string;
  placement?: string;
  popperModifiers?: { [key: string]: any };
  wrapperClassName?: string;
  handleChange: (date: any) => void;
  value?: any;
  minDate?: any;
  maxDate?: any;
  minTime?: any;
  maxTime?: any;
  showTimeSelect?: boolean;
  disabled?: boolean;
  placeholder?: string;
  dateFormat?: string;
  showYearPicker?: boolean;
  showMonthYearPicker?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
}
const EnglishDatePicker: React.SFC<DateProps> = (props) => {
  const {
    id,
    name,
    disabled = false,
    className,
    placement = "bottom-start",
    popperModifiers,
    wrapperClassName = "",
    value,
    dateFormat,
    minDate,
    maxDate,
    minTime,
    maxTime,
    placeholder,
    showYearPicker = false,
    showMonthYearPicker = false,
    showTimeSelectOnly = false,
    handleChange,
    showTimeSelect,
    timeIntervals = 15,
  } = props;
  const _calendar: any = useRef<DatePicker>();

  const [selectedDate, setselectedDate] = useState<Date | null | undefined>(null);
  // If invalid date
  useEffect(() => {
    try {
      if (value) {
        const date = new Date(value);
        let currentValue = date.getTime() ? date : null;
        setselectedDate(currentValue);
      } else {
        setselectedDate(null);
      }
    } catch (e) {
      setselectedDate(null);
    }
  }, [value]);

  return (
    <DatePicker
      ref={_calendar}
      id={id}
      autoComplete={"off"}
      name={name}
      wrapperClassName={`${wrapperClassName} d-block`}
      className={className}
      selected={selectedDate}
      minDate={minDate ? new Date(minDate) : null}
      maxDate={maxDate ? new Date(maxDate) : null}
      minTime={minTime}
      maxTime={maxTime}
      onChange={handleChange}
      onChangeRaw={(e) => e.preventDefault()} //Disables input
      showTimeSelect={showTimeSelect}
      timeFormat="HH:mm"
      timeIntervals={timeIntervals}
      timeCaption="Time"
      popperPlacement={"bottom-start"}
      popperModifiers={popperModifiers}
      dateFormat={dateFormat ? dateFormat : showTimeSelect ? "yyyy-MM-dd h:mm aa" : "yyyy-MM-dd"}
      showYearDropdown
      showMonthDropdown
      disabled={disabled}
      showTimeSelectOnly={showTimeSelectOnly}
      placeholderText={placeholder || ""}
      showYearPicker={showYearPicker}
      showMonthYearPicker={showMonthYearPicker}
    />
  );
};

export default EnglishDatePicker;
