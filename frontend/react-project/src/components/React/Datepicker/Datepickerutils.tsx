import { HTMLAttributes } from "react"
import { convertADtoBS, calendarData, convertBStoAD } from "./Dateconverter";


const nepaliCount = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const convertEngToNepNumber = (number: any) => {
    return number ? number.toString().split("").map((number: number) => nepaliCount[number] ? nepaliCount[+number] : number).join("") : number;
}
export const convertNepToEngNumber = (number: any) => {
    return number ? number.toString().split("").map((number: string) => nepaliCount.indexOf(number) > -1 ? nepaliCount.indexOf(number) : number).join("") : number;
}

export const zeroPad = (num: number): string => `${num > 9 ? num : "0" + num}`

export const childOf = (childNode: any, parentNode: any): boolean => parentNode.contains(childNode)

export const stitchDate = (date: SplittedDate, separator: string = "-"): string => {
    return `${date.year}${separator}${zeroPad(date.month)}${separator}${zeroPad(date.day)}`
}

export const range = (start: number, end: number, step: number = 1): number[] => {
    const list: number[] = []

    for (let i = start; i <= end; i = i + step) {
        list.push(i)
    }

    return list
}

export const getDateObject = (date: string | Date) => {
    const today: Date = new Date(date);
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    return {year, month, day}
}

export const executionDelegation = (execution: voidFunction, delegatedExecution: voidFunction) => {
    new Promise((resolve) => {
        execution()
        resolve(null)
    }).then(() => {
        delegatedExecution()
    })
}

export const splitDate = (date: string, separator: string = "-"): SplittedDate => {
    const [year, month, day] = date.split(separator)

    return {
        day: parseInt(day, 10),
        month: parseInt(month, 10),
        year: parseInt(year, 10),
    }
}


export const validateAdYear = (year: number) => {
    const minAdYear = calendarData.minBsYear - 57
    const maxAdYear = calendarData.maxBsYear - 57

    if (year < minAdYear || year > maxAdYear) {
        throw new RangeError(`AD year should be in range of ${minAdYear} to ${maxAdYear}`)
    }
}

export const validateAdMonth = (month: number) => {
    if (month < 1 || month > 12) {
        throw new RangeError("AD month should be in range of 1 to 12")
    }
}

export const validateAdDay = (day: number) => {
    if (day < 1 || day > 31) {
        throw new RangeError("AD day should be in range of 1 to 31")
    }
}

export const validateBsYear = (year: number) => {
    const midBsYear = calendarData.minBsYear
    const maxBsYear = calendarData.maxBsYear

    if (year < midBsYear || year > maxBsYear) {
        throw new RangeError(`BS year should be in range of ${midBsYear} to ${maxBsYear}`)
    }
}

export const validateBsMonth = (month: number) => {
    if (month < 1 || month > 12) {
        throw new RangeError("BS month should be in range of 1 to 12")
    }
}

export const validateBsDay = (day: number) => {
    if (day < 1 || day > 32) {
        throw new RangeError("BS day should be in range of 1 to 32")
    }
}


export const getNumberOfDaysInBSMonth = (yearMonth: { year: number; month: number }): number => {
    const { year, month } = yearMonth
    validateBsYear(year)
    validateBsMonth(month)

    let yearCount = 0
    const totalYears = year + 1 - calendarData.minBsYear
    const bsMonthData: number[] = calendarData.extractedBsMonthData[month - 1]

    return bsMonthData.reduce((numberOfDays: number, monthData: number, index: number) => {
        if (monthData === 0 || numberOfDays !== 0) {
            return numberOfDays
        }

        const bsMonthUpperDaysIndex = index % 2
        yearCount += monthData
        if (totalYears > yearCount) {
            return numberOfDays
        }

        if ((year === 2085 && month === 5) || (year === 2088 && month === 5)) {
            return calendarData.bsMonthUpperDays[month - 1][bsMonthUpperDaysIndex] - 2
        }

        return calendarData.bsMonthUpperDays[month - 1][bsMonthUpperDaysIndex]
    }, 0)
}

export const validateDateObject = (date: SplittedDate, type: string = BS) => {
    const { year, month, day } = date

    if (type === BS) {
        validateBsYear(year)
        validateBsMonth(month)
        validateBsDay(day)

        return
    }

    validateAdYear(year)
    validateAdMonth(month)
    validateAdDay(day)
}

export const parseBSDate = (date: string, separator: string = "-"): ParsedDate => {
    const { year, month, day }: SplittedDate = splitDate(date, separator)

    validateDateObject({ year, month, day })

    const adDate = new Date(BSToAD(date))
    const firstAdDateInBSMonth = new Date(BSToAD(stitchDate({ year, month, day: 1 }, separator)))
    const numberOfDaysInMonth = getNumberOfDaysInBSMonth({ year, month })

    return {
        adDate,
        bsDay: day,
        bsMonth: month,
        bsYear: year,
        firstAdDayInBSMonth: firstAdDateInBSMonth,
        numberOfDaysInBSMonth: numberOfDaysInMonth,
        weekDay: adDate.getDay(),
    }
}

export const ADToBS = (date: Date) => {
    const englishdate = getDateObject(date);
    const nepaliDate = convertADtoBS(englishdate.year, englishdate.month, englishdate.day);
    return stitchDate({year: nepaliDate.bsYear, month: nepaliDate.bsMonth, day: nepaliDate.bsDate});
}

export const BSToAD = (date: string) => {
    const nepaliDate = date.split("-");
    const englishDate = convertBStoAD(+nepaliDate[0], +nepaliDate[1], +nepaliDate[2]);
    return new Date(englishDate);
}





// Datepicker Types
export type voidFunction = () => void

export const ENGLISH = "en"
export const NEPALI = "nep"
export const BS = "BS"
export const AD = "AD"

export type localeType = "en" | "nep"

export interface NepaliDatePickerOptions {
    closeOnSelect?: boolean
    // calenderLocale: localeType
    // valueLocale: localeType
}

export interface INepaliDatePicker extends NepaliDatePickerOptions {
    value?: string
    engDate?: string
    id?: string
    name?: string
    className?: HTMLAttributes<HTMLDivElement>["className"]
    wrapperClassName?: HTMLAttributes<HTMLInputElement>["className"]
    onChange?: (nepdate: string, engdate: Date | string) => void
    onSelect?: (value: string) => void
    options?: NepaliDatepickerEvents
    maxDate?: string
    maxDateToday?: boolean;
    minDate?: string
    minDateToday?: boolean;
    disabled?: boolean;
}

export interface NepaliDatePickerProps {
    value?: INepaliDatePicker["value"]
    className?: INepaliDatePicker["className"]
    wrapperClassName?: INepaliDatePicker["wrapperClassName"]
    onChange?: INepaliDatePicker["onChange"]
    onSelect?: INepaliDatePicker["onSelect"]
    options?: {
        closeOnSelect?: NepaliDatePickerOptions["closeOnSelect"]
        // calenderLocale?: NepaliDatePickerOptions["calenderLocale"]
        // valueLocale?: NepaliDatePickerOptions["valueLocale"]
    }
}

export interface NepaliDatepickerEvents {
    change?: (value: string) => void
    yearSelect?: (year: number) => void
    monthSelect?: ({ year, month }: YearMonth) => void
    daySelect?: ({ year, month, day }: YearMonthDate) => void
    previousMonthSelect?: ({ month, year }: YearMonth) => void
    nextMonthSelect?: ({ year, month }: YearMonth) => void
    todaySelect?: ({ year, month, day }: YearMonthDate) => void
}

export interface ParsedDate {
    bsYear: number
    bsMonth: number
    bsDay: number
    weekDay: number
    adDate: Date
    numberOfDaysInBSMonth: number
    firstAdDayInBSMonth: Date
}

export const parsedDateInitialValue: ParsedDate = {
    adDate: new Date(),
    bsDay: 0,
    bsMonth: 0,
    bsYear: 0,
    firstAdDayInBSMonth: new Date(),
    numberOfDaysInBSMonth: 0,
    weekDay: 0,
}

export interface SplittedDate {
    year: number
    month: number
    day: number
}

export type YearMonthDate = SplittedDate

export interface YearMonth {
    year: number
    month: number
}