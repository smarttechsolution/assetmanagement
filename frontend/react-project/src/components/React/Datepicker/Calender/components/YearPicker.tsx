import React, { FunctionComponent, useMemo, useState } from "react"
import { DropDown, OptionType } from "./DropDown"
import { ParsedDate, range } from "../../Datepickerutils"
import { convertEngToNepNumber } from "../../Datepickerutils"

interface YearPickerProps {
    date: ParsedDate
    onSelect: (year: number) => void
    minYear: number;
    maxYear: number;
}

const YearPicker: FunctionComponent<YearPickerProps> = ({ date, onSelect, minYear, maxYear }) => {
    const [showDropdown, setShowDropdown] = useState(false)

    const currentYear: OptionType = useMemo((): OptionType => {
        const year = date.bsYear

        return {
            label: year.toString(),
            value: year,
        }
    }, [date])

    const years: OptionType[] = useMemo(
        (): OptionType[] =>
            range(minYear || 1970, maxYear || 2100)
                // .reverse()
                .map(
                    (year: number): OptionType => ({
                        label: convertEngToNepNumber(year.toString()),
                        value: year,
                    }),
                ),
        [],
    )

    const handleDropdownView = (selected: OptionType) => {
        setShowDropdown(!showDropdown)
        onSelect(selected.value)
    }

    return (
        <div className='control year'>
            <span className='current-year' onClick={() => setShowDropdown(!showDropdown)}>
                {convertEngToNepNumber(currentYear.label)}
            </span>
            {showDropdown && <DropDown options={years} value={currentYear.value} onSelect={handleDropdownView} />}
        </div>
    )
}

export default YearPicker
