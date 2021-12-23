import { EditIcon } from "assets/images/xd";
import React from "react";
import "./GeneralCard.scss";

interface Props {
  title: any;
  className?: string;
  children?: any;
  action?: any;
}

export const GeneralCard = (props: Props) => {
  return (
    <div className={`generalCard ${props.className || ""}`}>
      <div className="generalCard-header">
        <h6 className="generalCard-header-title">{props.title}</h6>
        {props.action && (
          <div className="action" role="button" onClick={props.action}>
            <img src={EditIcon} alt="" />
          </div>
        )}
      </div>

      {props.children}
    </div>
  );
};
