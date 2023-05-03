import { IMPACT_OF_FAILURE_ENUM, MITIGATION_ENUM, PARAMETER_TYPES_ENUM, POSSIBILITY_OF_FAILURE_ENUM, RESPONSIBLE_ENUM } from "./types"

const DAYS_OPTIONS = [
    { label: 'Sunday', value: "Sunday" },
    { label: 'Monday', value: "Monday" },
    { label: 'Tuesday', value: "Tuesday" },
    { label: 'Wednesday', value: "Wednesday" },
    { label: 'Thursday', value: "Thursday" },
    { label: 'Friday', value: "Friday" },
    { label: 'Saturday', value: "Saturday" },
]

export { DAYS_OPTIONS }


export const ENG_MONTHS_IN_ENG = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
export const ENG_MONTHS_IN_NEP = ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्त", "सेप्टेम्बर", "अक्टोबर", "नोवेम्बर ", "डिसेम्बर"]

export const NEP_MONTHS_IN_NEP = ["बैशाख", "जेठ", "असार", "श्रावण", "भदौ", "आश्विन", "कार्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत्र"]
export const NEP_MONTHS_IN_ENG = ["Baisakh", "Jestha", "Ashar", "Shrawan", "Bhadra", "Ashoj", "Kartik", "Mangshir", "Poush", "Magh", "Falgun", "Chaitra"]

export const ENG_NEP_NUMBERS = {
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९",
    "0": "o",
    "-": "-",
    "_": "_",
    ",": ",",
    ".": ".",
    ":": ":",
    "/": "/",
    " ": " ",
}


export const NEP_ENG_NUMBERS = {
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9",
    "०": "0",
    "-": "-",
    "_": "_",
    ",": ",",
    ".": ".",
    ":": ":",
    "/": "/",
    " ": " ",
    
}


export const SYSTEM_DATE_FORMAT_OPTIONS = [
    { label: 'NEP', value: "nep" },
    { label: 'EN', value: "en" },
]

export const EXPENSE_CATTEGORY = [
    { label: 'Income', value: "Income" },
    { label: 'Expenditure', value: "Expenditure" },
]


export const IMPACT_OF_FAILURE_OPTIONS = [
    { label: IMPACT_OF_FAILURE_ENUM.TOTAL_LOSS_OF_FUNCTION, value: IMPACT_OF_FAILURE_ENUM.TOTAL_LOSS_OF_FUNCTION },
    { label: IMPACT_OF_FAILURE_ENUM.REDUCTION_OF_SYSTEM_FUNCTIONALITY, value: IMPACT_OF_FAILURE_ENUM.REDUCTION_OF_SYSTEM_FUNCTIONALITY },
    { label: IMPACT_OF_FAILURE_ENUM.REDUCTION_OF_PARTS_FUNCTIONALITY, value: IMPACT_OF_FAILURE_ENUM.REDUCTION_OF_PARTS_FUNCTIONALITY },
    { label: IMPACT_OF_FAILURE_ENUM.HARDLY_ANY_EFFECTS, value: IMPACT_OF_FAILURE_ENUM.HARDLY_ANY_EFFECTS },
]

export const POSSIBILITY_OF_FAILURE_OPTIONS = [
    { label: POSSIBILITY_OF_FAILURE_ENUM.HIGH, value: POSSIBILITY_OF_FAILURE_ENUM.HIGH },
    { label: POSSIBILITY_OF_FAILURE_ENUM.MEDIUM, value: POSSIBILITY_OF_FAILURE_ENUM.MEDIUM },
    { label: POSSIBILITY_OF_FAILURE_ENUM.LOW, value: POSSIBILITY_OF_FAILURE_ENUM.LOW },
    { label: POSSIBILITY_OF_FAILURE_ENUM.MINIMAL, value: POSSIBILITY_OF_FAILURE_ENUM.MINIMAL },
]

export const MITIGATION_OPTIONS = [
    { label: MITIGATION_ENUM.REACTIVE, value: MITIGATION_ENUM.REACTIVE },
    { label: MITIGATION_ENUM.INSPECTION, value: MITIGATION_ENUM.INSPECTION },
    { label: MITIGATION_ENUM.PREVENTIVE, value: MITIGATION_ENUM.PREVENTIVE },

]

export const RESPONSIBLE_OPTIONS = [
    { label: RESPONSIBLE_ENUM.CARETAKER, value: RESPONSIBLE_ENUM.CARETAKER },
    { label: RESPONSIBLE_ENUM.TECHNICIAN, value: RESPONSIBLE_ENUM.TECHNICIAN },
    { label: RESPONSIBLE_ENUM.OTHERS, value: RESPONSIBLE_ENUM.OTHERS },

]

export const PARAMETER_TYPES_OPTIONS = [
    { label: PARAMETER_TYPES_ENUM.CHEMICAL, value: PARAMETER_TYPES_ENUM.CHEMICAL },
    { label: PARAMETER_TYPES_ENUM.PHYSICAL, value: PARAMETER_TYPES_ENUM.PHYSICAL},
    { label: PARAMETER_TYPES_ENUM.OTHERS, value: PARAMETER_TYPES_ENUM.OTHERS },
]