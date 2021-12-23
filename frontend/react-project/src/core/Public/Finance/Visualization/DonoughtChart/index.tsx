import GeneralChart from "components/UI/Charts/General";
import { GeneralCard } from "components/UI/GeneralCard";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import DataTable from "./DataTable";

type IncomeExponeseDistribution = {
  this_year: { value: number; name: string }[];
  all_time: { value: number; name: string }[];
};

interface Props extends PropsFromRedux {}

const DonoughtChart = (props: Props) => {
  const { t } = useTranslation(["home", "finance"]);

  const [incomeDistriBution, setIncomeDisttribution] = useState<IncomeExponeseDistribution>();
  const [expenseDistriBution, setExpenseDisttribution] = useState<IncomeExponeseDistribution>();

  const [incomeTableData, setIncomeTableData] = useState<any>();
  const [expenseTableData, setExpenseTableData] = useState<any>();

  useEffect(() => {
    const seriesIncomeData: IncomeExponeseDistribution = {
      this_year: props.incomeByCategory?.income_this_year.map((item) => ({
        value: item.total_amount,
        name: item.category__name,
      })),
      all_time: props.incomeByCategory?.income_all_time.map((item) => ({
        value: item.total_amount,
        name: item.category__name,
      })),
    };
    const seriesExpenseData: IncomeExponeseDistribution = {
      this_year: props.expenseByCategory?.expense_this_year.map((item) => ({
        value: item.total_amount,
        name: item.category__name,
      })),
      all_time: props.expenseByCategory?.expense_all_time.map((item) => ({
        value: item.total_amount,
        name: item.category__name,
      })),
    };

    const incomeTableData = props.incomeByCategory?.income_this_year.map((item) => ({
      name: item.category__name,
      value: {
        this_year: item.total_amount,
        all_time: props.incomeByCategory?.income_all_time.find(
          (income) => income.category__name === item.category__name
        )?.total_amount,
      },
    }));
    const expenseTableData = props.expenseByCategory?.expense_this_year.map((item) => ({
      name: item.category__name,
      value: {
        this_year: item.total_amount,
        all_time: props.expenseByCategory?.expense_all_time.find(
          (income) => income.category__name === item.category__name
        )?.total_amount,
      },
    }));

    setIncomeTableData(incomeTableData);
    setExpenseTableData(expenseTableData);

    setIncomeDisttribution(seriesIncomeData);
    setExpenseDisttribution(seriesExpenseData);
  }, [props.incomeByCategory, props.expenseByCategory]);

  console.log(
    incomeDistriBution?.this_year?.reduce((sum: any, acc) => sum + (acc.value || 0), 0),
    "asdasdasdasd"
  );

  var colorPalette = ["#0371D0", "#9457F7", "#93A3FA", "#8DE9FF"];

  var colorPalette2 = ["#FF9696", "#FFCBCB", "#E1C2FC", "#FF7070"];

  return (
    <div className="row">
      <div className="col-lg-6">
        <GeneralCard title={t("home:incomeDistribution")} className="mr-md-3 mt-2">
          <GeneralChart
            minHeight={250}
            options={{
              tooltip: {
                trigger: "item",
                formatter: `{a} <br/>{b} : {c} ({d}%)`,
              },
              legend: {
                bottom: "bottom",
                // top: "10%",
                // orient: "vertical",
                formatter: "{name}",
              },

              series: [
                {
                  name: t("home:thisYear"),
                  type: "pie",
                  radius: ["55%", "65%"],
                  center: ["25%", "45%"],
                  label: {
                    show: true,
                    position: "center",
                    formatter: function () {
                      return `Rs  ${
                        getNumberByLanguage(
                          incomeDistriBution?.this_year?.reduce(
                            (sum: any, acc) => sum + (acc.value || 0),
                            0
                          )
                        ) || 0
                      }`;
                    },
                  },
                  data: incomeDistriBution?.this_year,
                  color: colorPalette,
                },
                {
                  name: t("home:allTime"),
                  type: "pie",
                  radius: ["55%", "65%"],
                  center: ["75%", "45%"],
                  label: {
                    show: true,
                    position: "center",
                    formatter: function () {
                      return `Rs  ${
                        getNumberByLanguage(
                          incomeDistriBution?.all_time?.reduce(
                            (sum: any, acc) => sum + (acc.value || 0),
                            0
                          )
                        ) || 0
                      }`;
                    },
                  },
                  data: incomeDistriBution?.all_time,
                  color: colorPalette,
                },
              ],
            }}
          />
          <DataTable
            tableData={incomeTableData}
            headers={[t("home:thisYear"), t("home:allTime")]}
          />
        </GeneralCard>
      </div>
      <div className="col-lg-6">
        <GeneralCard title={t("home:expenditureDistribution")} className="ml-md-3  mt-2">
          <GeneralChart
            minHeight={250}
            options={{
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
              },
              legend: {
                bottom: "bottom",
                // top: "10%",
                // orient: "vertical",
                formatter: "{name}",
              },

              series: [
                {
                  name: t("home:thisYear"),
                  type: "pie",
                  radius: ["55%", "65%"],
                  center: ["25%", "45%"],
                  //   itemStyle: {
                  //     borderRadius: 5,
                  //   },
                  label: {
                    show: true,
                    position: "center",
                    formatter: function () {
                      return `Rs  ${getNumberByLanguage(
                        expenseDistriBution?.this_year?.reduce(
                          (sum: any, acc) => sum + (acc.value || 0),
                          0
                        ) || 0
                      )}`;
                    },
                  },

                  data: expenseDistriBution?.this_year,
                  color: colorPalette2,
                },
                {
                  name: t("home:allTime"),
                  type: "pie",
                  radius: ["55%", "65%"],
                  center: ["75%", "45%"],
                  //   itemStyle: {
                  //     borderRadius: 5,
                  //   },
                  label: {
                    show: true,
                    position: "center",
                    formatter: function () {
                      return `  Rs  ${getNumberByLanguage(
                        expenseDistriBution?.all_time?.reduce(
                          (sum: any, acc) => sum + (acc.value || 0),
                          0
                        ) || 0
                      )}`;
                    },
                  },
                  data: expenseDistriBution?.all_time,
                  color: colorPalette2,
                },
              ],
            }}
          />
          <DataTable
            tableData={expenseTableData}
            headers={[t("home:thisYear"), t("home:allTime")]}
          />
        </GeneralCard>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  incomeByCategory: state.reportData.incomeByCategoryData.data,
  expenseByCategory: state.reportData.expenseByCategoryData.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DonoughtChart);
