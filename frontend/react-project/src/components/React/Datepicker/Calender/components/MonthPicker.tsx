import React, { FunctionComponent, useMemo, useState } from "react"
import { DropDown, OptionType } from "./DropDown"
import { localeType, ParsedDate } from "../../Datepickerutils"
import { calendarData } from "../../Dateconverter"

interface MonthPickerProps {
    date: ParsedDate
    onSelect: (year: number) => void
    minMonth: number;
    maxMonth: number;
    minYear: number;
    maxYear: number;
}

const MonthPicker: FunctionComponent<MonthPickerProps> = ({ date, onSelect, minMonth, maxMonth, maxYear, minYear }) => {
    const [showDropdown, setShowDropdown] = useState(false)

    const currentMonth: OptionType = useMemo((): OptionType => {
        const month = date.bsMonth

        return {
            label: calendarData.bsMonths[month - 1],
            value: month,
        }
    }, [date])

    const monthList: OptionType[] = useMemo(() => {
        return calendarData.bsMonths.map((month, index) => ({
            label: month,
            value: index + 1,
        })).filter((month) => {
            if(minMonth && maxMonth){
                return (date.bsYear > minYear ? true : (+month.value >= minMonth)) && (date.bsYear < maxYear ? true : (+month.value <= maxMonth))
            }
            if(minMonth){
                return date.bsYear > minYear ? true : (+month.value >= minMonth)
            }
            if(maxMonth){
                return date.bsYear < maxYear ? true : (+month.value <= maxMonth)
            }
            return true;
        })
    }, [date, minMonth, maxMonth, minYear, maxYear])

    const handleDropdownView = (selected: OptionType) => {
        setShowDropdown(!showDropdown)
        onSelect(selected.value)
    }

    return (
        <div className='control month'>
            <span className='current-month' onClick={() => setShowDropdown(!showDropdown)}>
                {currentMonth.label}
            </span>
            {showDropdown && <DropDown options={monthList} value={currentMonth.value} onSelect={handleDropdownView} />}
        </div>
    )
}

export default MonthPicker
