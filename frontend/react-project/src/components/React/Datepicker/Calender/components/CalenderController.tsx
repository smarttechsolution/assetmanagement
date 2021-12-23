import React, { FunctionComponent, useEffect, useState } from "react"
import { NextIcon, PreviousIcon, TodayIcon } from "./Icons"
import { ParsedDate } from "../../Datepickerutils"
import MonthPicker from "./MonthPicker"
import YearPicker from "./YearPicker"

interface CalenderControllerProps {
    onNextMonth: () => void
    onPreviousMonth: () => void
    onToday: () => void
    onYearSelect: (year: number) => void
    onMonthSelect: (year: number) => void
    calenderDate: ParsedDate
    minDate: {year: number, month: number, day: number}
    maxDate: {year: number, month: number, day: number}
}

const CalenderController: FunctionComponent<CalenderControllerProps> = (props) => {
    const { onNextMonth, onPreviousMonth, calenderDate, onToday, onYearSelect, onMonthSelect, minDate, maxDate } = props

    const [disableNext, setdisableNext] = useState(false)
    const [disablePrevious, setdisablePrevious] = useState(false)
    const [disableToday, setdisableToday] = useState(false)

    useEffect(() => {
        if(maxDate.year && maxDate.month){
            setdisableNext(() => maxDate.year <= calenderDate.bsYear && maxDate.month <= calenderDate.bsMonth);
            setdisableToday(() => maxDate.year <= calenderDate.bsYear && maxDate.month <= calenderDate.bsMonth && maxDate.day < calenderDate.bsDay);
        }
        if(minDate.year && minDate.month){
            setdisablePrevious(() => minDate.year >= calenderDate.bsYear && minDate.month >= calenderDate.bsMonth);
            setdisableToday(() => minDate.year >= calenderDate.bsYear && minDate.month >= calenderDate.bsMonth && maxDate.day > calenderDate.bsDay);
        }
        
    }, [minDate, maxDate, calenderDate])


    return (
        <div className='calendar-controller'>
            <span className={`control icon ${disablePrevious ? "disabled" : ""}`} title={"अघिल्लो"} onClick={() => !disablePrevious && onPreviousMonth()}>
                <PreviousIcon />
            </span>

            <div className='date-indicator'>
                <MonthPicker date={calenderDate} onSelect={onMonthSelect} maxYear={maxDate.year} minYear={minDate.year} maxMonth={maxDate.month} minMonth={minDate.month}/>
                <YearPicker date={calenderDate} onSelect={onYearSelect} maxYear={maxDate.year} minYear={minDate.year}/>
            </div>

            {/* <span className='control icon icon-today' title={"आज"} onClick={() => !disableToday && onToday()}>
                <TodayIcon color='#2096f5' />
            </span> */}

            <span className={`control icon ${disableNext ? "disabled" : ""}`} title={"अर्को"} onClick={() => !disableNext && onNextMonth()}>
                <NextIcon />
            </span>
        </div>
    )
}

export default CalenderController
