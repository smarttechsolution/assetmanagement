import GeneralChart from "components/UI/Charts/General";
import CustomCheckBox from "components/UI/CustomCheckbox";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { MaintainanceCostSingleType } from "store/modules/report/maintainanceCost";
import { RootState } from "store/root-reducer";
import { getYearFromDate } from "utils/utilsFunction/date-converter";
import DataTable from "./DataTable";

type SeriesConfig = {
  name: string | undefined;
  type: string;
  stack: string;
  areaStyle: {
    color: string | undefined;
  };
  data: number[];
};

interface singleItemType {
  value: any;
  itemStyle: {
    color: string;
  };
}

interface ChartDataType {
  actual_unsegregated: singleItemType[];
  actual_material: singleItemType[];
  actual_labor: singleItemType[];
  actual_replacement: singleItemType[];
  expected_unsegregated: singleItemType[];
  expected_material: singleItemType[];
  expected_labor: singleItemType[];
  expected_replacement: singleItemType[];
  expected_total;
  actual_total;
  years: (string | number)[];
}

interface Props extends PropsFromRedux {
  selected: string[];
  setSelected: any;
}

const BarChart = (props: Props) => {
  const { selected, setSelected } = props;

  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ChartDataType>();

  const [seriesData, setSeriesData] = useState<SeriesConfig[]>();

  const [tableData, setTableData] = useState<any>();

  const options = [
    {
      id: "actual_unsegregated",
      name: `${t("home:actual")} ${t("home:unsegregated")}`,
      color: "#e69f00",
    },
    {
      id: "actual_material",
      name: `${t("home:actual")} ${t("home:consumable")}`,
      color: "#56b4e9",
    },
    {
      id: "actual_labor",
      name: `${t("home:actual")} ${t("home:labour")}`,
      color: "#f0e442",
    },
    {
      id: "actual_replacement",
      name: `${t("home:actual")} ${t("home:replacement")}`,
      color: "#ea75b6",
    },
    {
      id: "expected_unsegregated",
      name: `${t("home:expected")} ${t("home:unsegregated")}`,
      color: "#009e73",
    },
    {
      id: "expected_material",
      name: `${t("home:expected")} ${t("home:consumable")}`,
      color: "#000000",
    },
    {
      id: "expected_labor",
      name: `${t("home:expected")} ${t("home:labour")}`,
      color: "#d55e00",
    },
    {
      id: "expected_replacement",
      name: `${t("home:expected")} ${t("home:replacement")}`,
      color: "#0072b2",
    },
  ];

  useEffect(() => {
    if (props.maintainanceCost) {
      const sortAndMapArray = (array: MaintainanceCostSingleType[], key: string, color: string) => {
        return array.map((item) => ({
          value: item[key] || 0,
          itemStyle: { color },
        }));
      };

      const chartData = {
        years: props.maintainanceCost?.expected_cost.map(
          (item, index) =>
            `${t("home:year")} ${getNumberByLanguage(index + 1)} -  ${getNumberByLanguage(
              getYearFromDate(item.date_from)
            )} - ${getNumberByLanguage(getYearFromDate(item.date_to))}`
        ),
        actual_unsegregated: sortAndMapArray(
          props.maintainanceCost.actual_cost,
          "unsegregated_cost",
          "#e69f00"
        ),
        actual_material: sortAndMapArray(
          props.maintainanceCost.actual_cost,
          "material_cost",
          "#56b4e9"
        ),
        actual_labor: sortAndMapArray(props.maintainanceCost.actual_cost, "labour_cost", "#f0e442"),
        actual_replacement: sortAndMapArray(
          props.maintainanceCost.actual_cost,
          "replacement_cost",
          "#ea75b6"
        ),
        expected_unsegregated: sortAndMapArray(
          props.maintainanceCost.expected_cost,
          "unsegregated_cost",
          "#009e73"
        ),
        expected_material: sortAndMapArray(
          props.maintainanceCost.expected_cost,
          "material_cost",
          "#000000"
        ),
        expected_labor: sortAndMapArray(
          props.maintainanceCost.expected_cost,
          "labour_cost",
          "#d55e00"
        ),
        expected_replacement: sortAndMapArray(
          props.maintainanceCost.expected_cost,
          "replacement_cost",
          "#0072b2"
        ),
        expected_total: props.maintainanceCost.expected_cost.map((item) => ({
          date: item.maintenance_date__year,
          value: item.actual_cost_total || 0,
        })),

        actual_total: props.maintainanceCost.actual_cost.map((item) => ({
          date: item.maintenance_date__year,
          value: item.actual_cost_total || 0,
        })),
      };

      setChartData(chartData);
    }
  }, [props.language, props.maintainanceCost]);

  const handleSelect = (name: string) => {
    if (selected?.includes(name)) {
      const filteredData = selected.filter((item) => item !== name);
      setSelected(filteredData);
    } else {
      setSelected([...selected, name]);
    }
  };

  useEffect(() => {
    const selectedData = selected.map((item, index) => ({
      name: options.find((opt) => opt.id === item)?.name,
      type: "bar",
      stack: item?.includes("expec") ? "expected" : "actual",
      areaStyle: {
        color: options.find((opt) => opt.id === item)?.color,
      },
      data: chartData && chartData[item],
    }));

    const tableData = selected.map((item) => ({
      name: options.find((opt) => opt.id === item)?.name || "",
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

  console.log(seriesData, "->>>> asdadad");

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
  maintainanceCost: state.reportData.maintainanceCostData.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(BarChart);
