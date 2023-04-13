import GeneralChart from "components/UI/Charts/General";
import { getFiscalYearData, getMonthByLanguageAndScheme, getNumberByLanguage } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import IncomeExpendTable from "./IncomeExpendTable";
import { useTranslation } from "react-i18next";

interface Props extends PropsFromRedux {}

const IncomeExpendGraphThisYear = (props: Props) => {
  const { incomeExpenseData } = props;
  const { t } = useTranslation(["home"]);

  const [months, setMonths] = useState<(string | number)[]>([]);
  const [income, setIncome] = useState<(string | number)[]>([]);
  const [expense, setExpense] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (incomeExpenseData && props.intervalData) {
      const fiscalYearArray = getFiscalYearData(
        props.intervalData,
        props.schemeDetails?.system_date_format
      );

      const yearArray = fiscalYearArray?.map((item) => {
        return getMonthByLanguageAndScheme(item, props.schemeDetails?.system_date_format);
      });

      const incomeArray = fiscalYearArray?.map((item) => {
        return (
          incomeExpenseData.income?.find((inc) => {
            return +inc.date__month < 10
              ? +inc.date__month?.toString()?.replace("0", "") === item
              : +inc.date__month === item;
          })?.total_amount || 0
        );
      });

      const expenseArray = fiscalYearArray?.map((item) => {
        return (
          incomeExpenseData.expense?.find((inc) => {
            return +inc.date__month < 10
              ? +inc.date__month?.toString()?.replace("0", "") === item
              : +inc.date__month === item;
          })?.total_amount || 0
        );
      });

      setMonths(yearArray);
      setIncome(incomeArray || []);
      setExpense(expenseArray || []);
    }
  }, [incomeExpenseData, props.intervalData]);

  return (
    <>
      <GeneralChart
        minHeight={350}
        options={{
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
            // formatter: handleCustomTooltip,
          },
          legend: {
            show: false,
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "8%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: months,
            axisLabel: {
              formatter: function (name) {
                return name?.replace("Year", "") || "";
              },
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: function (name) {
                return getNumberByLanguage(name);
              },
            },
          },
          series: [
            {
              name: `${t("home:total")} ${t("home:income")} `,
              type: "line",
              smooth: true,
              data: income,
              lineStyle: { color: "#4DFFFF" },
            },
            {
              name: `${t("home:total")} ${t("home:expense")} `,
              type: "line",
              smooth: true,
              data: expense,
              lineStyle: { color: "#ff4D4D" },
            },
          ],
        }}
      />

      <IncomeExpendTable months heading={months} income={income} expense={expense} />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  incomeExpenseData: state.reportData.incomeExpenseData.data,
  intervalData: state.waterSchemeData.getYearIntervals.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(IncomeExpendGraphThisYear);
