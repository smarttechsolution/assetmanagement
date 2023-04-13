import { CheckmarkIcon } from "assets/images/xd";
import React from "react";
import { useTranslation } from "react-i18next";
import { DashboardComponentInfoType } from "store/modules/maintainance/dashboardComponentInfo";

interface Props {}

const NormalDataHeader = (props: Props) => {
  const {t} = useTranslation(['maintainance'])

  return (
    <>
      <th scope="col" rowSpan={2} className="vertical-header mitigation-tab">
      {t('maintainance:reactive')}
      </th>
      <th scope="col" rowSpan={2} className="vertical-header ">
      {t('maintainance:inspection')}
      </th>
      <th scope="col" rowSpan={2} className="vertical-header">
      {t('maintainance:preventive')}
      </th>
      {/* <th scope="col" rowSpan={2} className="vertical-header responsible-tab">
      {t('maintainance:caretaker')}
      </th>
      <th scope="col" rowSpan={2} className="vertical-header">
      {t('maintainance:technician')}
      </th>
      <th scope="col" rowSpan={2} className="vertical-header">
      {t('maintainance:others')}
      </th> */}
    </>
  );
};

export default NormalDataHeader;

interface NormalDataProps {
  data: DashboardComponentInfoType;
}

export const NormalData = (props: NormalDataProps) => {
  console.log(props.data.responsible, "resspsso");
  return (
    <>
      <td className="text-center">{props.data.mitigation === "Reactive" ? (<> <img src={CheckmarkIcon} alt="" /> </>) : ""}</td>
      <td className="text-center">{props.data.mitigation === "Inspection" ? (<> <img src={CheckmarkIcon} alt="" /> </>) : ""}</td>
      <td className="text-center">{props.data.mitigation === "Preventive" ? (<> <img src={CheckmarkIcon} alt="" /> </>) : ""}</td>
      {/* <td className={`${props.data.responsible === "Caretaker" ? "bg-lightblue" : ""} `}></td>
      <td className={`${props.data.responsible === "Technician" ? "bg-lightblue" : ""} `}></td>
      <td className={`${props.data.responsible === "Others" ? "bg-lightblue" : ""} `}></td> */}
    </>
  );
};
