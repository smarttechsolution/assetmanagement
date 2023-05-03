import GeneralChart from "components/UI/Charts/General";
import CustomCheckBox from "components/UI/CustomCheckbox";
import { Console, log } from "console";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import DataTable from "./DataTable";
import { getNumberByLanguage } from "i18n/i18n";

const config = {
  name: "",
  type: "line",
  smooth: true,
  // yAxisIndex: 0,
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
  total_supply?: (string | number)[];
  daily_avg?: (string | number)[];
  non_revenue_water?: (string | number)[];
  revenue_water?: (string |number)[];
};

interface Props extends PropsFromRedux {
  type?: string;
  options: any[];
  compareKey: string;
  defaultSelected: string[];
  key:string;
}

const VisualizationBarGraph = (props: Props) => {
  const [chartData, setChartData] = useState<ChartDataType>();

  const [seriesData, setSeriesData] = useState<SeriesConfig[]>();

  const [tableData, setTableData] = useState<any>();

  const [selected, setSelected] = useState<string[]>(props.defaultSelected);

  useEffect(() => {
    const newData: ChartDataType = {
      xAxis: props.waterSupplyData?.supply?.map((item) => `${item[props.compareKey]}`),
<<<<<<< HEAD
      total_supply: props.waterSupplyData?.supply?.map((item) => item.total_supply), 
      daily_target: props.waterSupplyData?.supply?.map((item) => props.waterSupplyData?.daily_target), 
    }; 
=======
      daily_avg: props.waterSupplyData?.supply?.map((item) => item.total_supply_average),
      total_supply: props.waterSupplyData?.supply?.map((item) => item.total_supply),
      // non_revenue_water: props.waterSupplyData?.supply?.map((item) => item.non_revenue_water)
      non_revenue_water: props.waterSupplyData?.supply?.map((item) =>
        Number(item.non_revenue_water) || 0
      ),
      revenue_water: props.waterSupplyData?.supply?.map((item) =>
        Number(item.revenue_water) || 0
      ),
    };
    
>>>>>>> ams-final
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
<<<<<<< HEAD
    const selectedData = selected?.map((item, index) => ({
      ...config,
      name: props.options.find((opt) => opt.id === item)?.name || "",
      type: "bar",
=======
    const selectedData = selected?.map((item) => ({
      ...config,
      name: props.options.find((opt) => opt.id === item)?.name || "",
      // type: "line",
>>>>>>> ams-final
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
    console.log(tableData,"==============");
    
    setSeriesData(selectedData);
    setTableData(tableData)
  }, [chartData, selected]);

  // const optionData = {
  //   tooltip: {
  //     trigger: "axis",
  //     axisPointer: {
  //       type: "shadow",
  //     },
  //   },

  //   xAxis: [
  //     {
  //       type: "category",
  //       data: chartData?.xAxis,
  //       axisLabel: { interval: 0, rotate: 25 },
  //     },
  //   ],
  //   yAxis: [
  //     {
  //       type: "value",
  //       name: "", 
  //     },
  //     {
  //       type: "value",
  //       name: "", 
  //     },
  //   ],
  //   series: seriesData,
  // };

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
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: chartData?.xAxis,
        axisLabel: {
          formatter: function(name) {
            return name?.replace(props.compareKey, "")
          },
          rotate:25,
        }
      },
    ],
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

<<<<<<< HEAD
  console.log(seriesData, "seriessdaddadadad")

=======
>>>>>>> ams-final
  return (
    <div className="row">
      <div className="col-md-9">
        <GeneralChart minHeight={400} options={optionData} />
        {tableData?.length > 0 && props.compareKey &&(
          <DataTable years={chartData?.xAxis} tableData={tableData} key={props.key} type={props.compareKey} />
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

export default connector(VisualizationBarGraph);
