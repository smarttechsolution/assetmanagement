import React, { FC, InputHTMLAttributes } from "react";
import TooltipLabel from "../TooltipLabel";
import "./customRadio.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  tooltipData?: string;
}

const CustomRadio: FC<InputProps> = ({ label, id, tooltipData, ...rest }) => {
  return (
    <>
      <label className="customRadio" htmlFor={id + label}>
        {label}
        {tooltipData &&<> &nbsp;&nbsp; <TooltipLabel id={id} text={tooltipData} /></> }
        <input type="checkbox" id={id + label} {...rest} />
        <span className="radio-checkmark"></span>
      </label>
    </>
  );
};

export default CustomRadio;
