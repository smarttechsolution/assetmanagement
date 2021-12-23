import React, { FunctionComponent, useCallback, useMemo } from "react"
import { ParsedDate, SplittedDate, ADToBS, getNumberOfDaysInBSMonth, range, splitDate } from "../../../Datepickerutils"
import { calendarData } from "../../../Dateconverter"
import { convertEngToNepNumber } from "../../../Datepickerutils"

interface DayPickerBodyProps {
    selectedDate: ParsedDate
    calenderDate: ParsedDate
    onSelect: (date: SplittedDate) => void
    minDate: {year: number, month: number, day: number}
    maxDate: {year: number, month: number, day: number}
}

interface DayInfo {
    day: number
    month: number
    year: number
    isCurrentMonth: boolean
    isToday: boolean
    isSelected: boolean
}

const DayPickerBody: FunctionComponent<DayPickerBodyProps> = ({ selectedDate, calenderDate: date, onSelect, minDate, maxDate }) => {
    const weeksInMonth = useMemo(
        () => Math.ceil((date.firstAdDayInBSMonth.getDay() + date.numberOfDaysInBSMonth) / 7) - 1,
        [date],
    )
    const previousMonth = useMemo(() => (date.bsMonth - 1 !== 0 ? date.bsMonth - 1 : 12), [date])
    const previousYear = useMemo(() => (previousMonth === 12 ? date.bsYear - 1 : date.bsYear), [previousMonth, date])
    const previousMonthDays = useMemo(
        () =>
            previousYear >= calendarData.minBsYear
                ? getNumberOfDaysInBSMonth({
                    month: previousMonth,
                    year: previousYear,
                })
                : 30,
        [previousYear],
    )

    const getDayInfo = useCallback(
        (weekNum, weekDayNum): DayInfo => {
            let day = weekNum * 7 + weekDayNum - date.firstAdDayInBSMonth.getDay()
            const month = date.bsMonth
            const year = date.bsYear

            let isCurrentMonth = true

            if (day <= 0) {
                day = previousMonthDays + day
                isCurrentMonth = false
            } else if (day > date.numberOfDaysInBSMonth) {
                day = day - date.numberOfDaysInBSMonth
                isCurrentMonth = false
            }

            const today = splitDate(ADToBS(new Date()))

            const isToday = isCurrentMonth
                ? today.day === day && today.month === date.bsMonth && today.year === date.bsYear
                : false
            const isSelected = isCurrentMonth
                ? selectedDate.bsDay === day &&
                  selectedDate.bsMonth === date.bsMonth &&
                  selectedDate.bsYear === date.bsYear
                : false

            return { day, month, year, isCurrentMonth, isToday, isSelected }
        },
        [date, selectedDate, previousMonthDays],
    )

    const onDateSelectHandler = useCallback(
        (dayInfo: DayInfo) => {
            if (dayInfo.isCurrentMonth) {
                onSelect({ year: dayInfo.year, month: dayInfo.month, day: dayInfo.day })
            }
        },
        [onSelect],
    )

    return (
        <tbody>
            {range(0, weeksInMonth).map((weekNum) => (
                <tr key={weekNum}>
                    {range(1, 7).map((weekDayNum) => {
                        const dayInfo = getDayInfo(weekNum, weekDayNum);

                        let dayDisabled = false;
                        if(minDate.year && minDate.month && minDate.day) {
                            dayDisabled = date.bsYear <= minDate.year && date.bsMonth <= minDate.month && dayInfo.day < minDate.day;
                        }
                        if(maxDate.year && maxDate.month && maxDate.day) {
                            dayDisabled = date.bsYear >= maxDate.year && date.bsMonth >= maxDate.month && dayInfo.day > maxDate.day;
                        }
                        if(minDate.day && maxDate.day){
                            dayDisabled = (
                                (date.bsYear <= minDate.year && date.bsMonth <= minDate.month && dayInfo.day < minDate.day)
                                ||
                                (date.bsYear >= maxDate.year && date.bsMonth >= maxDate.month && dayInfo.day > maxDate.day)
                                )
                        }
                        return (
                            <td
                                key={weekDayNum}
                                className={`month-day ${dayDisabled ? "disabled" : ""} ${dayInfo.isCurrentMonth ? "current" : "disabled"} ${dayInfo.isToday ? "today" : ""} ${dayInfo.isSelected ? "selected" : ""}`}
                                onClick={() => !dayDisabled && onDateSelectHandler(dayInfo)}
                            >
                                {convertEngToNepNumber(dayInfo.day)}
                            </td>
                        )
                    })}
                </tr>
            ))}
        </tbody>
    )
}

export default DayPickerBody
