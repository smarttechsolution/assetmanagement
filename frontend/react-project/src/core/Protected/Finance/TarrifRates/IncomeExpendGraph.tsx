import GeneralChart from "components/UI/Charts/General";
import IncomeExpendTable from "core/Public/Home/IncomeExpend/IncomeExpendTable";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getExpenseCumulativeAction } from "store/modules/report/expenseCumilitiveCashFlow";
import { getIncomeExpenseAction } from "store/modules/report/incomeExpense";
import { RootState } from "store/root-reducer";
import { getYearFromDate } from "utils/utilsFunction/date-converter";

interface Props extends PropsFromRedux {}

const IncomeExpendGraph = (props: Props) => {
  const { incomeExpenseData } = props;
  const { t } = useTranslation(["home"]);

  const [years, setYears] = useState<(string | number)[]>([]);
  const [income, setIncome] = useState<(string | number)[]>([]);
  const [expense, setExpense] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (props.schemeSlug) {
      props.getExpenseCumulativeAction(props.schemeSlug);
    }
  }, [props.schemeSlug]);

  useEffect(() => {
    if (incomeExpenseData) {
      const yearArray = incomeExpenseData?.expected_income?.map(
        (item) =>
          ` ${getNumberByLanguage(getYearFromDate(item.date_from))} - ${getNumberByLanguage(
            getYearFromDate(item.date_to)
          )}`
      );
      const incomeArray = incomeExpenseData?.expected_income?.map((item) => item.income_amount);
      const expenseArray = incomeExpenseData?.expected_expense?.map((item) => item.expense_amount);

      setYears(yearArray);
      setIncome(incomeArray);
      setExpense(expenseArray);
    }
  }, [incomeExpenseData]);

  console.log(incomeExpenseData, "<<<<<<<<incomeExpenseData");

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
            data: years,
            axisLabel: {
              formatter: function (name) {
                return name?.split("-")[0]?.replace("Year", "");
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

      <IncomeExpendTable heading={years} income={income} expense={expense} />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  incomeExpenseData: state.reportData.expenseCumulativeCashFlowData.data,
});

const mapDispatchToProps = {
  getIncomeExpenseAction: getIncomeExpenseAction,
  getExpenseCumulativeAction: getExpenseCumulativeAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(IncomeExpendGraph);
