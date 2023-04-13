import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getIncomeExpenseAction } from "store/modules/report/incomeExpense";
import { RootState } from "store/root-reducer";
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";

interface IProps extends PropsFromRedux {}

const Table = (props: IProps) => {
  const { t } = useTranslation();
  const is_used_based = props.incomeEstimates?.use_base;

  console.log(props.incomeEstimates, "props.incomeEstimates");

  const showTableOtherThanUseBased =
    props.incomeEstimates?.rate_for_institution ||
    props.incomeEstimates?.rate_for_household ||
    props.incomeEstimates?.rate_for_commercial ||
    props.incomeEstimates?.rate_for_public ||
    props.incomeEstimates?.estimated_paying_connection_commercial ||
    props.incomeEstimates?.estimated_paying_connection_public ||
    props.incomeEstimates?.estimated_paying_connection_institution ||
    props.incomeEstimates?.total_connection||
    props.incomeEstimates?.estimated_paying_connection_household;

  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            {is_used_based ? (
              <tr>
                <th style={{}}>{t("home:sn")}</th>
                <th style={{}}>{t("finance:unitRange")}</th>
                <th style={{}}>{t("home:rate")} {t("finance:permnth")}</th>
                <th style={{ whiteSpace: "break-spaces" }} colSpan={2}>
                  {t("finance:epc")} (%)
                </th>
                <th style={{}} className="text-right">
                  {t("home:total")}
                </th>
              </tr>
            ) : showTableOtherThanUseBased ? (
              <tr>
                <th style={{ whiteSpace: "break-spaces", fontSize: 12 }}>{t("finance:sn")}</th>
                <th style={{ whiteSpace: "break-spaces", fontSize: 12 }}>{t("finance:roh")}</th>
                <th style={{ whiteSpace: "break-spaces", fontSize: 12 }}>{t("finance:roi")}</th>
                <th style={{ whiteSpace: "break-spaces", fontSize: 12 }}>{t("finance:rop")}</th>
                <th style={{ whiteSpace: "break-spaces", fontSize: 12 }}>{t("finance:roc")}</th>
                <th style={{ whiteSpace: "break-spaces", fontSize: 12 }}>{t("finance:epch")}</th>
                <th style={{ whiteSpace: "break-spaces", fontSize: 12 }}>{t("finance:epci")}</th>
                <th style={{ whiteSpace: "break-spaces", fontSize: 12 }}>{t("finance:epcp")}</th>
                <th style={{ whiteSpace: "break-spaces", fontSize: 12 }}>{t("finance:epcc")}</th>
                <th style={{ fontSize: 12 }}></th>
                <th>{t("home:total")}</th>
              </tr>
            ) : (
              <></>
            )}
          </thead>
          <tbody>
            {is_used_based ? (
              <>
                {props.incomeEstimates?.use_base?.map((item, index) => (
                  <tr key={index}>
                    <td>{getNumberByLanguage(index + 1)}</td>
                    <td> {item.unit_from} - {item.unit_to} Units</td>
                    <td> {props.scheme?.currency} {item.rate}</td>
                    <td colSpan={2}>
                      {item.estimated_paying_connection}% of {getNumberByLanguage(props.incomeEstimates?.total_connection)}
                    </td>

                    <td className="text-right">
                      {props.scheme?.currency}. {item.income_total || "-"}
                    </td>
                  </tr>
                ))}

                <tr className="table-border-top">
                  <td className="text-right" colSpan={5}>
                    {t("finance:otherinc")}
                  </td>
                  <td className="text-right" colSpan={3}>
                    {props.incomeEstimates?.other_income || "-"}
                  </td>
                </tr>
                <tr className="">
                  <td className="text-right" colSpan={5}>
                    {t("finance:total")}
                  </td>
                  <td colSpan={2} className="text-right">
                    {props.incomeEstimates?.total_income || "-"}
                  </td>
                </tr>
              </>
            ) : showTableOtherThanUseBased ? (
              <>
                <tr>
                  <td>1</td>
                  <td> {props.scheme?.currency} {getNumberByLanguage(props.incomeEstimates?.rate_for_household)}</td>
                  <td> {props.scheme?.currency} {getNumberByLanguage(props.incomeEstimates?.rate_for_institution)}</td>
                  <td> {props.scheme?.currency} {getNumberByLanguage(props.incomeEstimates?.rate_for_public)}</td>
                  <td> {props.scheme?.currency} {getNumberByLanguage (props.incomeEstimates?.rate_for_commercial)}</td>
                  <td>{getNumberByLanguage (props.incomeEstimates?.estimated_paying_connection_household)} %</td>
                  <td>{getNumberByLanguage (props.incomeEstimates?.estimated_paying_connection_institution)} %</td>
                  <td>{getNumberByLanguage (props.incomeEstimates?.estimated_paying_connection_public)} %</td>
                  <td>{getNumberByLanguage (props.incomeEstimates?.estimated_paying_connection_commercial)} %</td>
                  <td></td>
                  <td>{getNumberByLanguage(props.incomeEstimates?.income)}</td>
                </tr>
                <tr className="table-border-top">
                  <td className="text-right" colSpan={8}>
                    {t("finance:OET")}
                  </td>
                  <td className="text-right" colSpan={3}>
                    {getNumberByLanguage(props.incomeEstimates?.other_income || 0)}
                  </td>
                </tr>
                <tr className="">
                  <td className="text-right" colSpan={8}>
                    {t("finance:total")}
                  </td>
                  <td className="text-right" colSpan={3}>
                    {getNumberByLanguage(props.incomeEstimates?.total_income || 0)}
                  </td>
                </tr>
              </>
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  incomeEstimates: state.waterTarrifsData.getIncomeEstimateThisYear.data,
});

const mapDispatchToProps = {
  getIncomeExpenseAction: getIncomeExpenseAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Table);
