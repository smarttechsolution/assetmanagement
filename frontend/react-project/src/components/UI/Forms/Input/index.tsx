import React, { FC, InputHTMLAttributes } from "react";
import "./input.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

const Input: FC<InputProps> = ({ name, label, ...rest }) => {
  return (
    <div className="customInput">
      <input type="text" id={name} className="input" {...rest} /> 
        <label htmlFor={name} className="label">
          <span className="span">{label || " "}</span>
        </label>
       
    </div>
  );
};

export default Input;
