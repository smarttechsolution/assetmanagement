import { IMPACT_OF_FAILURE_ENUM, POSSIBILITY_OF_FAILURE_ENUM } from "constants/types";
import React from "react";
import { DashboardComponentInfoType } from "store/modules/maintainance/dashboardComponentInfo";

interface HeaderProps {
  onClick;
}

const RiskDataHeader = (props: HeaderProps) => {
  return (
    <>
      <th scope="col" rowSpan={2} className="vertical-header bg-red mitigation-tab small">
        {IMPACT_OF_FAILURE_ENUM.TOTAL_LOSS_OF_FUNCTION}
      </th>
      <th scope="col" rowSpan={2} className="vertical-header bg-orange  small">
        {IMPACT_OF_FAILURE_ENUM.REDUCTION_OF_SYSTEM_FUNCTIONALITY}
      </th>
      <th scope="col" rowSpan={2} className="vertical-header bg-yellow small">
        {IMPACT_OF_FAILURE_ENUM.REDUCTION_OF_PARTS_FUNCTIONALITY}
      </th>
      <th scope="col" rowSpan={2} className="vertical-header bg-green responsible-tab small">
        {IMPACT_OF_FAILURE_ENUM.HARDLY_ANY_EFFECTS}
      </th>

      <th scope="" rowSpan={1}></th>
      <th scope="col" rowSpan={2} className="vertical-header bg-red small">
        {POSSIBILITY_OF_FAILURE_ENUM.HIGH}
      </th>
      <th scope="col" rowSpan={2} className="vertical-header bg-orange small">
        {POSSIBILITY_OF_FAILURE_ENUM.MEDIUM}
      </th>
      <th scope="col" rowSpan={2} className="vertical-header bg-yellow small">
        {POSSIBILITY_OF_FAILURE_ENUM.LOW}
      </th>
      <th scope="col" rowSpan={2} className="vertical-header bg-green small">
        {POSSIBILITY_OF_FAILURE_ENUM.MINIMAL}
      </th>
      <th scope="col" rowSpan={2} className=" text-center h6" role="button" onClick={props.onClick}>
        RISK <br />
        <br />
        &#8592;
      </th>
    </>
  );
};

export default RiskDataHeader;

interface BodyProps {
  data: DashboardComponentInfoType;
  onClick: any;
}

export const RiskData = (props: BodyProps) => {
  return (
    <>
      <td
        className={`${
          props.data.impact_of_failure === IMPACT_OF_FAILURE_ENUM.TOTAL_LOSS_OF_FUNCTION
            ? "bg-red"
            : "bg-border"
        } `}
      ></td>
      <td
        className={`${
          props.data.impact_of_failure === IMPACT_OF_FAILURE_ENUM.REDUCTION_OF_SYSTEM_FUNCTIONALITY
            ? "bg-orange"
            : " bg-border"
        } `}
      ></td>
      <td
        className={`${
          props.data.impact_of_failure === IMPACT_OF_FAILURE_ENUM.REDUCTION_OF_PARTS_FUNCTIONALITY
            ? "bg-yellow"
            : "bg-border"
        } `}
      ></td>
      <td
        className={`${
          props.data.impact_of_failure === IMPACT_OF_FAILURE_ENUM.HARDLY_ANY_EFFECTS
            ? "bg-green"
            : "bg-border"
        } `}
      ></td>
      <td className=""></td>
      <td
        className={`${
          props.data.possibility_of_failure === POSSIBILITY_OF_FAILURE_ENUM.HIGH
            ? "bg-red"
            : "bg-border"
        } `}
      ></td>
      <td
        className={`${
          props.data.possibility_of_failure === POSSIBILITY_OF_FAILURE_ENUM.MEDIUM
            ? "bg-orange"
            : " bg-border"
        } `}
      ></td>
      <td
        className={`${
          props.data.possibility_of_failure === POSSIBILITY_OF_FAILURE_ENUM.LOW
            ? "bg-yellow"
            : "bg-border"
        } `}
      ></td>
      <td
        className={`${
          props.data.possibility_of_failure === POSSIBILITY_OF_FAILURE_ENUM.MINIMAL
            ? "bg-green"
            : "bg-border"
        } `}
      ></td>
      <td
        className={`${
          props.data.resulting_risk_score <=4
            ? "bg-green"
            : props.data.resulting_risk_score <=8
            ? "bg-yellow"
            : props.data.resulting_risk_score <=12
            ? "bg-orange"
            : "bg-red"
        }`}
        role="button"
        onClick={() => props.onClick()}
      >
        {props.data.resulting_risk_score}
      </td>
    </>
  );
};
