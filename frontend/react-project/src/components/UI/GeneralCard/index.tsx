import { EditIcon, PrintIcon } from "assets/images/xd";
import React from "react";
import "./GeneralCard.scss";
import ReactToPrint from "react-to-print";
import { UncontrolledTooltip } from "reactstrap";

interface Props {
  title: any;
  className?: string;
  children?: any;
  action?: any;
  print?: boolean;
  componentRef?: any;
}

export const GeneralCard = (props: Props) => {
  const componentRef = React.useRef<any>(null);

  return (
    <div className={`generalCard ${props.className || ""}`} ref={componentRef}>
      <div className="generalCard-header">
        <h6 className="generalCard-header-title">{props.title}</h6>
        {props.action && (
          <div className="action" role="button" onClick={props.action}>
            <img src={EditIcon} alt="" />
          </div>
        )}
        {props.print && (
          <div className="action" role="button" onClick={props.action}>
            <UncontrolledTooltip placement="right" target="printData">
              Print
            </UncontrolledTooltip>
            <ReactToPrint
              trigger={() => (
                <div className="action" role="button" id="printData">
                  <img src={PrintIcon} alt="" style={{ filter: "none" }} className="mr-1" />
                </div>
              )}
              content={() => componentRef.current}
              documentTitle="Print"
            />
          </div>
        )}
      </div>

      {props.children}
    </div>
  );
};
