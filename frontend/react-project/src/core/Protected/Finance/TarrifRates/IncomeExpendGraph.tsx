import GeneralChart from "components/UI/Charts/General";
import IncomeExpendTable from "core/Public/Home/IncomeExpend/IncomeExpendTable";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
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
    props.getIncomeExpenseAction(props.language, props.schemeSlug);
  }, []);

  useEffect(() => {
    if (incomeExpenseData) {
      const yearArray = incomeExpenseData?.income?.map(
        (item) =>
          `${t("home:year")} ${getNumberByLanguage(item.year_num)} -  ${getNumberByLanguage(
            getYearFromDate(item.year_from)
          )} - ${getNumberByLanguage(getYearFromDate(item.year_to))}`
      );
      const incomeArray = incomeExpenseData?.income?.map((item) => item.total_amount);

      setYears(yearArray);
      setIncome(incomeArray);
    }
  }, [incomeExpenseData]);

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
              lineStyle: { color: "rgb(0,256,136)" },
            },
          ],
        }}
      />

      <IncomeExpendTable heading={years} income={income} />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  incomeExpenseData: state.reportData.incomeExpenseData.data,
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
});

const mapDispatchToProps = {
  getIncomeExpenseAction: getIncomeExpenseAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(IncomeExpendGraph);
