import React from "react";
import { useTranslation } from "react-i18next";
import { DashboardComponentInfoType } from "store/modules/maintainance/dashboardComponentInfo";

interface HeaderProps {
  onClick: any
}

const CostDataHeader = (props: HeaderProps) => {
  const {t} = useTranslation(['maintainance'])


  return (
    <>
      <th scope="col" className="bg-header">
      {t('maintainance:risk')}
      </th>
      <th scope="col" className="bg-header">
      {t('maintainance:maintainAction')}
      </th> 
      <th scope="col" className="bg-header">
      {t('maintainance:NAD')}
      </th>
      <th scope="col" className="bg-header">
      {t('home:expected')} {t('home:cost')}
      </th>
      <th scope="col" className="px-2" role="button" onClick={props.onClick}>
        <small> {t('maintainance:back')}  </small> <br />

        &#8592;
      </th>
    </>
  );
};

export default CostDataHeader;

interface BodyProps {
  data: DashboardComponentInfoType;
  currency: string
}

export const CostData = (props: BodyProps) => {
  return (
    <>
      <td className="text-left">{props.data.maintenance_action}</td> 
      <td className="text-left">{props.data.next_action}</td>
      <td className="text-left">{props.currency} {props.data.seggregated_or_unseggregated_cost}</td>
    </>
  );
};
