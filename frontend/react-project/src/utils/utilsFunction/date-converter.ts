import { ADToBS } from "components/React/Datepicker/Datepickerutils";

export default function formatDate(date?: string | Date) {
  if (date) {
    const dateVal: Date = date ? new Date(date) : new Date();
    let day = dateVal.getDate();
    let month = dateVal.getMonth() + 1;
    let year = dateVal.getFullYear();

    const formattedDate = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? "0" + day : day);

    return formattedDate;
  }

  return "";
}


export const getWeekDay = (string) => {
  return new Date(string).toLocaleString('en-us', { weekday: 'long' })?.substring(0, 3)?.toUpperCase()
}

export const getYearFromDate = (date) => {
  if (date) {
    const split = date.split("-")
    if (split) {
      return split[0]
    }
    return ""
  }
  return ""
}


export const getDefaultDate = (language: string) => {
  if (language === "nep") {
    return ADToBS(new Date())
  } else {
    return formatDate(new Date())
  }
}
