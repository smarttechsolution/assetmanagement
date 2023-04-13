import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English translation files
import enCommon from './locale/common/en.json';
import enLogin from './locale/login/en.json';
import enRegister from './locale/register/en.json';
import enSidebar from './locale/sidebar/en.json';
import enUserapproval from './locale/userapproval/en.json';
import enCashbook from './locale/cashbook/en.json';
import enFinance from './locale/Finance/en.json';
import enMaintain from './locale/maintainance/en.json';


// Nepali translation files
import neCommmon from './locale/common/ne.json';
import neLogin from './locale/login/ne.json';
import neRegister from './locale/register/ne.json';
import neSidebar from './locale/sidebar/ne.json';
import neUserapproval from './locale/userapproval/ne.json';
import neHome from './locale/Home/np.json';
import enHome from './locale/Home/en.json';
import neCashbook from './locale/cashbook/ne.json';
import neFinance from './locale/Finance/np.json';
import neMaintain from './locale/maintainance/nep.json';



import { ENG_NEP_NUMBERS, ENG_MONTHS_IN_ENG, ENG_MONTHS_IN_NEP, NEP_MONTHS_IN_NEP, NEP_MONTHS_IN_ENG, NEP_ENG_NUMBERS } from "constants/constants";
import { ADToBS, BSToAD } from "components/React/Datepicker/Datepickerutils";


export const i18nLanguages = ["en", "nep"];

// Translation resources
const resources = {
    en: {
        common: enCommon,
        login: enLogin,
        register: enRegister,
        sidebar: enSidebar,
        userapproval: enUserapproval,
        home: enHome,
        cashbook: enCashbook,
        finance: enFinance,
        maintainance: enMaintain
    },
    nep: {
        common: neCommmon,
        login: neLogin,
        register: neRegister,
        sidebar: neSidebar,
        userapproval: neUserapproval,
        home: neHome,
        cashbook: neCashbook,
        finance: neFinance,
        maintainance: neMaintain
    }
};

i18n
    // .use(Backend)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        lng: 'nep',
        fallbackLng: 'nep',
        whitelist: ['nep', 'en'],
        resources,
        ns: ['common'],
        defaultNS: "common",
        fallbackNS: "common",
        // backend: {
        //     loadPath: process.env.REACT_APP_ENDPOINT + '/config/i18n/res/{{lng}}/{{ns}}',
        //     crossDomain: true
        // },
        keySeparator: ".", // we use keys in form {t('messages.welcome')}
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

/**
 * Returns data in selected language
 * @param dataEn any data containing english language
 * @param dataNe any data containing nepali language
 */
export const getTextByLanguage = (dataEn: any, dataNe: any) => {
    switch (i18n.language) {
        case 'nep': return dataNe;
        default: return dataEn;
    }
}

/**
 * API request time out message in selected language
 */
export const requestTimeoutLanguage = () => {
    switch (i18n.language) {
        case 'nep': return "सर्भरले प्रतिक्रिया दिन धेरै लामो समय लिइरहेको छ, कृपया केहि बेरमा पुन: प्रयास गर्नुहोस्!";
        default: return "Server is taking too long to respond, please try again in sometime!";
    }
}

/**
 * When no internet or no conection to server message in selected language
 */
export const noConnectionLanguage = () => {
    switch (i18n.language) {
        case 'nep': return "सर्भरले प्रतिक्रिया दिन धेरै लामो समय लिईरहेको छ, यो कम कनेक्टिभटी वा हाम्रो सर्भरहरूको साथ त्रुटि द्वारा हुन सक्छ। कृपया केहि बेरमा पुन: प्रयास गर्नुहोस्!";
        default: return "Server is taking too long to respond, this can be caused by either poor connectivity or an error with our servers. Please try again in a while!";
    }
}

const nepaliCount = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
/**
 * Converts 123456 to 1,23,456
 * @param enNumber Number to convert into Nepali comma separated text
 */
export const nepaliNumeralFormat = (enNumber: number) => {
    let [integer, decimal] = enNumber.toString().split(".");

    let integerBeforeLastThreeDigits = integer.slice(0, integer.length - 3);
    const integerOfLastThreeDigits = integer.slice(integer.length - 3);
    if (integerBeforeLastThreeDigits.length > 2) {
        integerBeforeLastThreeDigits = integerBeforeLastThreeDigits.replace(/(\d)(?=(\d{2})+$)/g, '$1,') + ",";
    }

    integer = integerBeforeLastThreeDigits + integerOfLastThreeDigits;

    switch (i18n.language) {
        case 'nep': return integer + decimal;
        default: return integer + decimal;
    }
}

/**
 * Converts english number to nepali number as string
 * @param numberEn number in english
 */
export const convertEngToNepNumber = (numberEn: number) => {
    return numberEn.toString().split("").map((number) => nepaliCount[+number] ? nepaliCount[+number] : number).join("");
}

/**
 * Converts nepali number to english number as string
 * @param numberEn number text in nepali
 */
export const convertNepToEngNumber = (numberNe: string) => {
    return numberNe.split("").map((number: string) => nepaliCount.indexOf(number) > -1 ? nepaliCount.indexOf(number) : number).join("");
}


export const getMonthByLanguage = (month: number | string) => {
    switch (i18n.language) {
        case 'nep': return ENG_MONTHS_IN_NEP[+month];
        default: return ENG_MONTHS_IN_ENG[+month];
    }
}

export const getNumberByLanguage = (number) => {
    if (number || number === 0) {
        let transformedString = ""
        if (i18n.language === "nep") {
            // const parsedNumber = number?.toString()?.includes(".") ? Number(number)?.toFixed(2) : number
            const parsedNumber = number
            if (parsedNumber) {
                const originalData = number.toString() || "";
                [...originalData].forEach(c => {
                    transformedString = transformedString + ENG_NEP_NUMBERS[c]
                })
            } else {
                return number
            }
        } else {
            transformedString = number?.toString()
        }
        return transformedString;
    }
    return ""
}

export const getEnglishNumberFromNepali = (number) => {
    if (number) {
        let transformedString = ""
        const parsedNumber = number
        if (parsedNumber) {
            if (i18n.language === "nep") {
                const originalData = number.toString() || "";

                [...originalData].forEach(c => {
                    transformedString = transformedString + NEP_ENG_NUMBERS[c]
                })
            }else{
                transformedString = number
            }
        } else {
            return number
        }
        return transformedString;
    }
    return ""
}


export const getMonthByLanguageAndScheme = (month: number | string, language: string) => {
    if (month) {
        const reqMonth = +month < 10 ? month?.toString()?.replace("0", "") : +month

        if (language === "nep") {
            if (i18n.language === "nep") {
                return NEP_MONTHS_IN_NEP[+reqMonth - 1]
            } else {
                return NEP_MONTHS_IN_ENG[+reqMonth - 1]
            }
        } else {
            if (i18n.language === "nep") {
                return ENG_MONTHS_IN_NEP[+reqMonth - 1]
            } else {
                return ENG_MONTHS_IN_ENG[+reqMonth - 1]
            }
        }
    }
}



export const getFiscalYearData = (intervals: any, language: string) => {
    console.log(intervals, language, "{}{}{}{}{}}}{}");


    if (language === "nep") {
        const currentDate = new Date()

        let currentFiscalyear: any = null

        intervals.forEach(item => {
            if (new Date(BSToAD(item.end_date)).getTime() > new Date(currentDate).getTime() && new Date(BSToAD(item.start_date)).getTime() < new Date(currentDate).getTime()) {
                currentFiscalyear = item
            }
        })
        const startMonth = currentFiscalyear?.start_date?.split("-")[1]

        const fiscalYearMonth: any = []

        for (let i = startMonth; i <= 12; i++) {
            fiscalYearMonth.push(i < 10 ? +i?.toString()?.replace("0", "") : i)
        }
        for (let i = 1; i < startMonth; i++) {
            fiscalYearMonth.push(i < 10 ? +i?.toString()?.replace("0", "") : i)
        }
        return fiscalYearMonth

    } else {
        const currentDate = new Date()

        let currentFiscalyear: any = null

        intervals.forEach(item => {
            if (new Date(item.end_date).getTime() > currentDate.getTime() && new Date(item.start_date).getTime() < currentDate.getTime()) {
                currentFiscalyear = item
            }
        })

        const startMonth = currentFiscalyear?.start_date?.split("-")[1]

        const fiscalYearMonth: any = []

        for (let i = startMonth; i <= 12; i++) {
            fiscalYearMonth.push(i < 10 ? +i?.toString()?.replace("0", "") : i)
        }
        for (let i = 1; i < startMonth; i++) {
            fiscalYearMonth.push(i < 10 ? +i?.toString()?.replace("0", "") : i)
        }
        return fiscalYearMonth
    }
}


export const confirmationMessage = () => {
    switch (i18n.language) {
        case 'nep': return "के तपाइँ मेटाउन निश्चित हुनुहुन्छ?";
        default: return "Are you sure you want to delete ?";
    }
}

export default i18n;

