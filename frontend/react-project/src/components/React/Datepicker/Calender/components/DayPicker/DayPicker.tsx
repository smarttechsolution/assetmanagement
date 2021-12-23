import React, { FunctionComponent } from "react"
import { ParsedDate, SplittedDate } from "../../../Datepickerutils"
import DayPickerBody from "./DayPickerBody"
import DayPickerHeader from "./DayPickerHeader"

interface DayPickerProps {
    selectedDate: ParsedDate
    calenderDate: ParsedDate
    onDaySelect: (date: SplittedDate) => void
    minDate: {year: number, month: number, day: number}
    maxDate: {year: number, month: number, day: number}
}

const DayPicker: FunctionComponent<DayPickerProps> = ({ selectedDate, calenderDate, onDaySelect, minDate, maxDate }) => {
    return (
        <table>
            <DayPickerHeader />

            <DayPickerBody selectedDate={selectedDate} calenderDate={calenderDate} onSelect={onDaySelect} minDate={minDate} maxDate={maxDate} />
        </table>
    )
}

export default DayPicker
