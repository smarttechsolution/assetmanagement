import GeneralChart from "components/UI/Charts/General";
import CustomCheckBox from "components/UI/CustomCheckbox";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import { getYearFromDate } from "utils/utilsFunction/date-converter";
import DataTable from "./DataTable";
import { useSelector } from "react-redux";

const config = {
  name: "",
  type: "line",
  smooth: true,
  data: [],
};

type SeriesConfig = {
  name: string;
  type: string;
  smooth: boolean;
  data: (string | number)[];
};

type ChartDataType = {
  years: (string | number)[];
  actual_income?: (string | number)[];
  actual_expense?: (string | number)[];
  actual_cf?: (string | number)[];
  expected_income?: (string | number)[];
  expected_expense?: (string | number)[];
  expected_cf?: (string | number)[];
};

interface Props extends PropsFromRedux {
  selected: string[];
  setSelected: any
}

const LineChart = (props: Props) => {
  const { selected, setSelected } = props;
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ChartDataType>();

  const [seriesData, setSeriesData] = useState<SeriesConfig[]>();

  const [tableData, setTableData] = useState<any>();

  const currency = useSelector((state: RootState) => state.waterSchemeData.waterSchemeDetailsData.data?.currency)


  const options = [
    {
      id: "actual_income",
      name: `${t("home:actual")} ${t("home:income")} `,
      color: "#4DFFFF",
    },
    {
      id: "actual_expense",
      name: `${t("home:actual")} ${t("home:expense")}`,
      color: "#FF4D4D",
    },
    {
      id: "actual_cf",
      name: `${t("home:accf")}`,
      color: "#c47df7",
    },
    {
      id: "expected_income",
      name: `${t("home:expected")} ${t("home:income")}`,
      color: "#fbc757"
    },
    {
      id: "expected_expense",
      name: `${t("home:expected")} ${t("home:expense")}`,
      color: "#041C44",
    },
    {
      id: "expected_cf",
      name: `${t("home:eccf")}`,
      color: "#1d9a36",
    },
  ];

  useEffect(() => {
    const newData: ChartDataType = {
      years: props.incomeExpenseData?.income?.map(
        (item) =>
          `${t("home:year")} ${getNumberByLanguage(item.year_num)} -  ${getNumberByLanguage(
            getYearFromDate(item.year_from)
          )} - ${getNumberByLanguage(getYearFromDate(item.year_to))}`
      ),
      actual_income: props.incomeExpenseData?.income?.map((item) => item.total_amount),
      actual_expense: props.incomeExpenseData?.expense?.map((item) => item.total_amount),
      actual_cf: props.incomeExpenseData?.cf?.map((item) => item.cf),
      expected_income: props.expenseCF?.expected_income?.map((item) => item.income_amount),
      expected_expense: props.expenseCF?.expected_expense?.map((item) => item.expense_amount),
      expected_cf: props.expenseCF?.expected_cf?.map((item) => item.cf),
    };
    setChartData(newData);
  }, [props.incomeExpenseData, props.actualCF, props.expenseCF]);

  const handleSelect = (name: string) => {
    if (selected?.includes(name)) {
      const filteredData = selected.filter((item) => item !== name);
      setSelected(filteredData);
    } else {
      setSelected([...selected, name]);
    }
  };

  useEffect(() => {
    const selectedData = selected.map((item) => ({
      ...config,
      name: options.find((opt) => opt.id === item)?.name || "",
      data: chartData && chartData[item],
      itemStyle: { color: options.find((opt) => opt.id === item)?.color || "" },
    }));

    const tableData = selected.map((item) => ({
      name: options.find((opt) => opt.id === item)?.name + ` ( ${currency} )`,
      color: options.find((opt) => opt.id === item)?.color || "",
      data: chartData && chartData[item],
    }));

    setSeriesData(selectedData);
    setTableData(tableData);
  }, [chartData, selected]);

  const optionData = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      show: false,
    },
    grid: {
      left: "3%",
      right: "5%",
      bottom: "3%",
      top: "6%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: chartData?.years,
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
    series: seriesData,
  };

  return (
    <div className="row">
      <div className="col-md-9">
        <GeneralChart minHeight={300} options={optionData} />
       {tableData?.length > 0 && <DataTable years={chartData?.years} tableData={tableData} />}
      </div>
      <div className="col-md-3 chartOptions">
        <h6>Select</h6>
        <p>Visualization Parameters</p>

        <ul>
          {options.map((item) => (
            <li key={item.id}>
              <CustomCheckBox
                id={"" + item.id}
                label={item.name}
                onChange={(e) => handleSelect(item.id)}
                checked={selected.includes(item.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  incomeExpenseData: state.reportData.incomeExpenseData.data,
  actualCF: state.reportData.actualCumulativeCashFlowData.data,
  expenseCF: state.reportData.expenseCumulativeCashFlowData.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LineChart);
