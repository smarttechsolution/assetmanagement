const nepaliCount = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export const engtoNepNumber = (string: string | number) => {
  return string
    .toString()
    .replace(/[/]/g, "-")
    .split("")
    .map((number: string) =>
      nepaliCount[+number] ? nepaliCount[+number] : number
    )
    .join("");
};

const char_count = (str: string[], letter: string) => {
  let letter_Count = 0;
  for (let position = 0; position < str.length; position++) {
    if (str[position] === letter) {
      letter_Count += 1;
    }
  }
  return letter_Count;
};

const getNumber = (i: string, digit: string[]) => {
  if (isNaN(Number(i)) && i === "." && char_count(digit, ".") === 1) {
    return ".";
  }
  if (isNaN(Number(i))) {
    return "";
  }

  return i;
};

export const getCommaSeperateNumber = (_number: number | string) => {
  if (typeof _number === "string" && _number === "") return "";
  let x: string[] = `${_number}`.split("");
  for (let i of x) {
    let index = x.indexOf(i);
    x[index] = getNumber(i, x);
  }
  let y = x.join("");
  let afterPoint = "";
  if (y.indexOf(".") > 0) afterPoint = y.substring(y.indexOf("."), y.length);
  y = Math.floor(Number(y)).toString();
  let lastThree = y.substring(y.length - 3);
  let otherNumbers = y.substring(0, y.length - 3);
  if (otherNumbers !== "") lastThree = "," + lastThree;
  let res =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;

  let num: any;
  if (typeof _number === "string") {
    num = parseFloat(_number.replace(/,/g, ""));
  } else {
    num = _number;
  }
  return num < 0 ? `-${res}` : res;
};

export const getNumberfromCommaSeperated = (commaSeperatedNumber: string | number) => {
  if (typeof commaSeperatedNumber === "number") {
    return commaSeperatedNumber;
  }
  const number_: Array<string> = [];
  commaSeperatedNumber.split("").filter((value: string, index: number) => {
    if (
      (commaSeperatedNumber.charCodeAt(index) > 47 &&
        commaSeperatedNumber.charCodeAt(index) < 58) ||
      commaSeperatedNumber.charCodeAt(index) === 46
    ) {
      number_.push(value);
      return value;
    }
  });
  return Number(number_.join(""));
};