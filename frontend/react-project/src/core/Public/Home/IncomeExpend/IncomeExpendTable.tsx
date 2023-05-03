import { getNumberByLanguage } from "i18n/i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Table } from "reactstrap";
import { RootState } from "store/root-reducer";

interface Props {
  months?: any;
  heading: (string | number)[];
  income: (string | number)[];
  expense?: (string | number)[];
}

const IncomeExpendTable = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const currency = useSelector((state: RootState) => state.waterSchemeData.waterSchemeDetailsData.data?.currency)

  return (
    <div className="mt-3 income-expend">
      <div className="table-responsive">
        <Table className="table-02">
          <tbody>
            <tr>
              <td>{props.months ? t("home:month") : t("home:year")} </td>
              {props.heading?.map((data, index) => (
                <td key={index}>{data?.toString()?.split("-")[0]?.replace("Year", "")}</td>
              ))}
            </tr>
            <tr>
              <td>
                <span className="income-title">{t("home:income")} ( {currency} )</span>
              </td>
              {props.income?.map((value, index) => (
                <td style={{ width: 70 }} key={index}>
                  {/* {currency}  */}
                  {getNumberByLanguage(value) || 0}
                </td>
              ))}
            </tr>
            {props.expense && (
              <tr>
                <td>
                  <span className="expend-title">{t("home:expense")} ( {currency} )</span>
                </td>
                {props.expense.map((value, index) => (
                  <td style={{ width: 70 }} key={index}>
                    {/* ( {currency})  */}
                    {getNumberByLanguage(value) || 0}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default IncomeExpendTable;
