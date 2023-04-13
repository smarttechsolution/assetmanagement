import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";
import { Table } from "reactstrap";
// import { RootState } from "store/root-reducer";

interface Props {
  years: any;
  tableData: any;
  months?: any;
}

const DataTable = (props: Props) => {
  const { t } = useTranslation();

  // const currency = useSelector((state: RootState) => state.waterSchemeData.waterSchemeDetailsData.data?.currency)


  return (
    <div className="mt-3 income-expend">
      <div className="table-responsive">
        <Table className="table-02">
          <tbody>
            <tr>
              <td>{props.months ? t("home:month") : t("home:year")}</td>
              {props.years?.map((year, index) => (
                <td key={index}>{year?.toString()?.split("-")[0]?.replace("Year", "")}</td>
              ))}
            </tr>
            {props.tableData?.map((item, index) => (
              <tr key={index}>
                <td>
                  <span
                    className="income-title"
                    style={{ borderBottom: `5px solid ${item.color}` }}
                  >
                    {item.name}
                  </span>
                </td>
                {item.data?.map((data, index) => (
                  <td key={index}>
                    {/* {currency} */}
                    {getNumberByLanguage(props.months ? data?.value : data) || "0"}
                  </td>
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
