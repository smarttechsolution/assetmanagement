import React, { FC, InputHTMLAttributes } from "react";
import Input from "../Input";
import "./inputGroup.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}
const InputGroup: FC<InputProps> = ({ name, label, ...rest }) => {
  return (
    <div className="inputGroup">
      {label && <h6 className="label">{label}</h6>}
      <Input name={name} {...rest} />
    </div>
  );
};

export default InputGroup;
