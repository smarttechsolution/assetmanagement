import React, { FC, InputHTMLAttributes } from "react";
import "./customCheckbox.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

interface Props {
  label: string;
  id: string;
}

const CustomCheckBox: FC<InputProps> = ({ label, id, ...rest }) => {
  return (
    <>
      <label className="custom-checkbox" htmlFor={id}>
        {label}
        <input type="checkbox" id={id} {...rest} />
        <span className="checkmark"></span>
      </label>
    </>
  );
};

export default CustomCheckBox;
