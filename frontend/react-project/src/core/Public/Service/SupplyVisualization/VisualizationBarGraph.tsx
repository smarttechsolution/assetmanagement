import GeneralChart from "components/UI/Charts/General";
import CustomCheckBox from "components/UI/CustomCheckbox";
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";

const config = {
  name: "",
  type: "",
  smooth: true,
  yAxisIndex: 0,
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
  daily_target?: (string | number)[];
};

interface Props extends PropsFromRedux {
  type?: string;
  options: any[];
  compareKey: string;
  defaultSelected: string[];
}

const VisualizationBarGraph = (props: Props) => {
  const [chartData, setChartData] = useState<ChartDataType>();

  const [seriesData, setSeriesData] = useState<SeriesConfig[]>(); 

  const [selected, setSelected] = useState<string[]>(props.defaultSelected);

  useEffect(() => {
    const newData: ChartDataType = {
      xAxis: props.waterSupplyData?.supply?.map((item) => `${item[props.compareKey]}`),
      total_supply: props.waterSupplyData?.supply?.map((item) => item.total_supply), 
      daily_target: props.waterSupplyData?.supply?.map((item) => props.waterSupplyData?.daily_target), 
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
    const selectedData = selected?.map((item, index) => ({
      ...config,
      name: props.options.find((opt) => opt.id === item)?.name || "",
      type: "bar",
      data: chartData && chartData[item],
      yAxisIndex: index,
      itemStyle: {
        color: props.options.find((opt) => opt.id === item)?.color || "",
      },
    }));
    setSeriesData(selectedData);
  }, [chartData, selected]);

  const optionData = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },

    xAxis: [
      {
        type: "category",
        data: chartData?.xAxis,
        axisLabel: { interval: 0, rotate: 25 },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "", 
      },
      {
        type: "value",
        name: "", 
      },
    ],
    series: seriesData,
  };

  console.log(seriesData, "seriessdaddadadad")

  return (
    <div className="row">
      <div className="col-md-9">
        <GeneralChart minHeight={400} options={optionData} /> 
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
