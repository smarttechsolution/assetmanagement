import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import { Calender } from "./Calender"
import { INepaliDatePicker, NepaliDatepickerEvents, childOf, stitchDate, ADToBS, BSToAD, validateBsYear, validateBsMonth, validateBsDay } from "./Datepickerutils"
import "./Datepicker.scss"


const NepaliDatePicker = (props: INepaliDatePicker) => {
    const { wrapperClassName, className = "form-control", value, disabled = false, engDate, onChange, onSelect, options = {}, closeOnSelect = true, maxDate, maxDateToday, minDate, minDateToday, id, name } = props;

    // DatePicker references
    const nepaliDatePickerWrapper = useRef<HTMLDivElement>(null)
    const nepaliDatePickerInput = useRef<HTMLInputElement>(null)

    const [date, setDate] = useState<string>("")
    const [showCalendar, setShowCalendar] = useState<boolean>(false)


    useEffect(() => {
        if (value) {
            // If invalid date
            try {
                if (value) {
                    const [year, month, day] = value.split("-");

                    if (!(year && month && day)) {
                        throw new RangeError("Invalid BS date")
                    }

                    validateBsYear(+year); //Throws Error if invalid
                    validateBsMonth(+month); //Throws Error if invalid
                    validateBsDay(+day); //Throws Error if invalid

                    setDate(value || "");
                }
            }
            catch (e) {
                setDate("");
                onChange && onChange("", "");
            }
        }
    }, [value])

    useEffect(() => {
        if (engDate) {
            let nepDate = ADToBS(new Date(engDate));
            if (!value || value !== nepDate) {
                onChange && onChange(nepDate, new Date(engDate));
            }
        }
    }, [engDate])

    const handleClickOutside = useCallback((event: any) => {
        if (nepaliDatePickerWrapper.current && childOf(event.target, nepaliDatePickerWrapper.current)) {
            return
        }

        setShowCalendar(false)
    }, [])

    useLayoutEffect(() => {
        if (showCalendar) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showCalendar])

    useLayoutEffect(() => {
        if (showCalendar && nepaliDatePickerWrapper.current) {
            const nepaliDatePicker = nepaliDatePickerWrapper.current.getBoundingClientRect()
            const screenHeight = window.innerHeight

            const calender: HTMLDivElement | null = nepaliDatePickerWrapper.current.querySelector(".calender")
            if (calender) {
                setTimeout(() => {
                    const calenderHeight = calender.clientHeight

                    if (calenderHeight + nepaliDatePicker.bottom > screenHeight) {
                        if (calenderHeight < nepaliDatePicker.top) {
                            calender.style.bottom = `${nepaliDatePicker.height}px`
                        }
                    }
                }, 0)
            }
        }
    }, [showCalendar])

    const handleOnChange = useCallback((changedDate: string) => {
        setDate(changedDate)
        if (onChange) {
            onChange(changedDate, BSToAD(changedDate))
        }
    }, [])

    const handleOnDaySelect = useCallback((selectedDate) => {
        if (closeOnSelect) {
            setShowCalendar(false)
        }
        if (onSelect) {
            onSelect(stitchDate(selectedDate))
        }
    }, [])

    const datepickerEvents: NepaliDatepickerEvents = {
        change: handleOnChange,
        daySelect: handleOnDaySelect,
        todaySelect: handleOnDaySelect,

        yearSelect: options.yearSelect,
        monthSelect: options.monthSelect,
        previousMonthSelect: options.previousMonthSelect,
        nextMonthSelect: options.nextMonthSelect
    }

    const [maxDateLimit, setmaxDateLimit] = useState({ year: 0, month: 0, day: 0 });
    useEffect(() => {
        if (maxDate || maxDateToday) {
            let maxDateMapped: any;
            if (maxDate) {
                maxDateMapped = maxDate?.split("-");
            }
            else if (maxDateToday) {
                maxDateMapped = ADToBS(new Date()).split("-");
            }
            setmaxDateLimit({ year: +maxDateMapped[0], month: +maxDateMapped[1], day: +maxDateMapped[2] });
        } else {
            setmaxDateLimit({ year: 0, month: 0, day: 0 });
        }
    }, [maxDate, maxDateToday])

    const [minDateLimit, setminDateLimit] = useState({ year: 0, month: 0, day: 0 });
    useEffect(() => {
        if (minDate || minDateToday) {
            let minDateMapped: any;
            if (minDate) {
                minDateMapped = minDate?.split("-");
            }
            else if (minDateToday) {
                minDateMapped = ADToBS(new Date()).split("-");
            }
            setminDateLimit({ year: +minDateMapped[0], month: +minDateMapped[1], day: +minDateMapped[2] });
        } else {
            setminDateLimit({ year: 0, month: 0, day: 0 });
        }
    }, [minDate, minDateToday])

    return (
        <div ref={nepaliDatePickerWrapper} className={`nepali-date-picker ${wrapperClassName || ""}`}>
            <input
                type='text'
                ref={nepaliDatePickerInput}
                className={className}
                id={id}
                name={name}
                readOnly={disabled}
                autoComplete="off"
                value={date}
                onClick={() => setShowCalendar(() => !showCalendar)}
            />
            <i className="ic-calendar" onClick={() => setShowCalendar(() => !showCalendar)}></i>
            {showCalendar &&
                <Calender
                    value={date}
                    events={datepickerEvents}
                    maxDate={maxDateLimit}
                    minDate={minDateLimit}
                />
            }
        </div>
    )
}

export default NepaliDatePicker;