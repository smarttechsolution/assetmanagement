import { QuestionIcon } from "assets/images/xd";
import React from "react";
import { UncontrolledTooltip } from "reactstrap";

interface IProps {
  id: string;
  text: string;
}

const TooltipLabel = (props: IProps) => {
  return (
    <>
      <span id={props.id}>
        <img src={QuestionIcon} alt="" style={{ width: 18 }} />
      </span>
      {props.text && (
        <UncontrolledTooltip placement="right" target={props.id}>
          {props.text}
        </UncontrolledTooltip>
      )}
    </>
  );
};

export default TooltipLabel;
