import GeneralChart from "components/UI/Charts/General";
import CustomCheckBox from "components/UI/CustomCheckbox";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import { getYearFromDate } from "utils/utilsFunction/date-converter";
import DataTable from "./DataTable";

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
  xAxis: (string | number)[];
  total_supply_avg?: (string | number)[];
  total_supply?: (string | number)[];
  non_revenue_water?: (string | number)[];
  revenue_water?:(string | number)[];
  // daily_target?: (string | number)[];
};

interface Props extends PropsFromRedux {
  type?: string;
  options: any[];
  compareKey: string;
  defaultSelected: string[];
  key: string;
}

const LineChart = (props: Props) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ChartDataType>();

  const [seriesData, setSeriesData] = useState<SeriesConfig[]>();

  const [tableData, setTableData] = useState<any>();

  const [selected, setSelected] = useState<string[]>(props.defaultSelected);

  useEffect(() => {
    const newData: ChartDataType = {
      xAxis: props.waterSupplyData?.supply?.map(
        (item, index) =>
          `${t("home:year")} ${getNumberByLanguage(index + 1)} -  ${getNumberByLanguage(
            getYearFromDate(item.date_from)
          )} - ${getNumberByLanguage(getYearFromDate(item.date_to))}`
      ),

      total_supply_avg: props.waterSupplyData?.supply?.map((item) => Number(item.total_supply_average)),
      total_supply: props.waterSupplyData?.supply?.map((item) => Number(item.total_supply)),
      non_revenue_water: props.waterSupplyData?.supply?.map((item) =>
        Number(item.non_revenue_water)
      ),
      revenue_water: props.waterSupplyData?.supply?.map((item) =>Number(item.revenue_water)),
      // daily_target: props.waterSupplyData?.supply?.map((item) => props.waterSupplyData?.daily_target),
    };
    setChartData(newData);
  }, [props.waterSupplyData]);

  const handleSelect = (name: string) => {
    if (selected?.includes(name)) {
      const filteredData = selected.filter((item) => item !== name);
      setSelected(filteredData);
    } else {
      setSelected([...selected, name]);
    }
  };

  useEffect(() => {
    const selectedData = selected?.map((item) => ({
      ...config,
      name: props.options.find((opt) => opt.id === item)?.name || "",
      data: chartData && chartData[item],
      itemStyle: {
        color: props.options.find((opt) => opt.id === item)?.color || "",
      },
    }));

    const tableData = selected?.map((item) => ({
      name: props.options.find((opt) => opt.id === item)?.name || "",
      color: props.options.find((opt) => opt.id === item)?.color || "",
      data: chartData && chartData[item],
    }));

    setSeriesData(selectedData);
    setTableData(tableData);
  }, [chartData, selected]);

  console.log(seriesData, ">>seriesData")

  const optionData = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      show: true,
    },
    grid: {
      left: "3%",
      right: "5%",
      bottom: "3%",
      //   top: "6%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: chartData?.xAxis,
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
        <GeneralChart minHeight={400} options={optionData} />
        {tableData?.length > 0 && props.type && (
          <DataTable years={chartData?.xAxis} tableData={tableData} key={props.key} type={props.type} />
        )}
      </div>
      <div className="col-md-3 chartOptions">
        <h6>Select</h6>
        <p>Visualization Parameters</p>

        <ul>
          {props.options?.map((item) => (
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
  waterSupplyData: state.reportData.waterSupplyData.data,
  incomeExpenseData: state.reportData.incomeExpenseData.data,
  actualCF: state.reportData.actualCumulativeCashFlowData.data,
  expenseCF: state.reportData.expenseCumulativeCashFlowData.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LineChart);
