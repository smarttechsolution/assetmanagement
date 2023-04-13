import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Table } from "reactstrap";
import { RootState } from "store/root-reducer";

interface Props {
  years: any;
  tableData: any;
  type: string;
  key: string;
}

const DataTable = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const currency = useSelector((state: RootState) => state.waterSchemeData.waterSchemeDetailsData.data?.currency)


  return (
    <div className="mt-3 income-expend">
      <div className="table-responsive">
        <Table className="table-02">
          <tbody>
            <tr>
              <td>{props.type === "month" ? t("home:month") : t("home:year")} </td>
              {props.years?.map((year, index) => {
                // console.log(props.key, 'props key', props)
                return props.type === 'Year' ?
                <td key={index}>{year?.toString()?.split("-")[0]?.replace("Year", "")}</td> :
                <td key={index}>{year?.toString()?.replace("Year", "")}</td>

              })}
            </tr>
            {props.tableData?.map((item, index) => (
              <tr key={index}>
                <td>
                  <span
                    className="income-title"
                    style={{ borderBottom: `5px solid ${item.color}` }}
                  >
                    {item.name}&nbsp;&nbsp;( Litres )
                  </span>
                </td>
                {item.data?.map((data, index) => (
                  // <td key={index}> {getNumberByLanguage(data) || 0} Litres</td> //Old Data
                  <td key={index}> {getNumberByLanguage(data) || 0}</td>    //New Data
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
