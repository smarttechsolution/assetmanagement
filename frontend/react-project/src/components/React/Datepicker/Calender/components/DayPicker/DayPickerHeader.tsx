import React, { FunctionComponent, useMemo } from "react"
import { calendarData } from "../../../Dateconverter"

const DayPickerHeader: FunctionComponent = () => {

    return (
        <thead>
            <tr>
                {calendarData.bsDays.map((weekDay: string, index: number) => (
                    <td key={index}>{weekDay}</td>
                ))}
            </tr>
        </thead>
    )
}

export default DayPickerHeader
