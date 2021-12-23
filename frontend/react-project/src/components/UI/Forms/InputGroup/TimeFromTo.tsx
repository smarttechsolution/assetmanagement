import React from "react";
import Input from "./index";
import "./inputGroup.scss";

const TimeFromTo = ({ label, from_name, to_name, values, setFieldValue }: any) => {
  return (
    <div className="form-group">
      <label htmlFor="" className="mr-1">
        {label}
      </label>

      <div className="d-flex">
        <input
          className="form-control"
          name={from_name}
          type="time"
          value={values[from_name]}
          onChange={(e) => {
            setFieldValue(from_name, e.target.value);
          }}
        />
        <input
          className="form-control ml-2"
          name={to_name}
          type="time"
          value={values[to_name]}
          onChange={(e) => {
            setFieldValue(to_name, e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default TimeFromTo;
