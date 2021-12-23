import React, { FC, InputHTMLAttributes } from "react";
import "./customRadio.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const CustomRadio: FC<InputProps> = ({ label, id, ...rest }) => {
  return (
    <>
      <label className="customRadio" htmlFor={id}>
        {label}
        <input type="checkbox" id={id} {...rest} />
        <span className="checkmark"></span>
      </label>
    </>
  );
};

export default CustomRadio;
