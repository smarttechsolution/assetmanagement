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

  return (
    <div className="data-table mt-4">
      <div className="table-responsive">
        <table className="table mt-2">
          <thead>
            {is_used_based ? (
              <tr>
                <th style={{  }}>{t("home:sn")}</th>
                <th style={{  }}>{t("finance:unitRange")}</th>
                <th style={{  }}>{t("home:rate")}</th>
                <th style={{ whiteSpace: "break-spaces",  }} colSpan={2}>{t("finance:epc")}</th> 
                <th style={{  }}  className="text-right">{t("home:total")}</th>
              </tr>
            ) : props.incomeEstimates?.rate_for_institution ? (
              <tr>
                <th style={{ fontSize:12 }}>{t("home:sn")}</th>
                <th style={{ fontSize:12 }}>
                  {t("home:rate")} {t("home:institutions")}
                </th>
                <th style={{ fontSize:12 }}>
                  {t("home:rate")} {t("home:households")}
                </th>
                <th style={{ whiteSpace: "break-spaces" , fontSize:12}}>
                  {t("finance:epc")} {t("home:institutions")} (%)
                </th>
                <th style={{ whiteSpace: "break-spaces", fontSize:12 }}>
                  {t("finance:epc")} {t("home:households")} (%)
                </th>
                <th style={{ fontSize:12 }}></th>
                <th >{t("home:total")}</th>
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
                    <td> {item.unit}</td>
                    <td> {item.rate}</td> 
                    <td colSpan={2} >{item.estimated_paying_connection} ({props.scheme?.currency}. {item.income || "-"}) x 12</td>
                    
                    <td className="text-right">
                      {props.scheme?.currency}. {item.income_total   || "-"}
                    </td>
                  </tr>
                ))}
                
                <tr  className="table-border-top">
                  <td className="text-right" colSpan={5}>Other Income</td>
                  <td  className="text-right" colSpan={3}>{props.incomeEstimates?.other_income || "-"}</td>
                </tr>
                <tr className="">   
                  <td className="text-right" colSpan={5}>Total</td>
                  <td colSpan={2}  className="text-right">{props.incomeEstimates?.total_income || "-"}</td>
                </tr>
              </>
            ) : props.incomeEstimates?.rate_for_institution ? (
              <>
                <tr>
                  <td>1</td>
                  <td> {props.incomeEstimates?.rate_for_institution}</td>
                  <td> {props.incomeEstimates?.rate_for_household}</td>
                  <td>{props.incomeEstimates?.estimated_paying_connection_institution}</td>
                  <td>{props.incomeEstimates?.estimated_paying_connection_household}</td>
                  <td></td>
                  <td>{props.incomeEstimates?.total_income}</td>
                </tr>
                <tr  className="table-border-top">
                  <td className="text-right" colSpan={5}>Other Parameters</td>
                  <td  className="text-right" colSpan={3}>{props.incomeEstimates?.other_income || "-"}</td>
                </tr>
                <tr  className="">
                  <td className="text-right" colSpan={4}>Total</td>
                  <td  className="text-right" colSpan={3}>{props.incomeEstimates?.total_income || "-"}</td>
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
