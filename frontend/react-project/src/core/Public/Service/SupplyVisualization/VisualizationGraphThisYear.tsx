import GeneralChart from "components/UI/Charts/General";
import CustomCheckBox from "components/UI/CustomCheckbox";
import { getFiscalYearData, getMonthByLanguageAndScheme } from "i18n/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
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
  revenue_water?: (string | number)[];
};

interface Props extends PropsFromRedux {
  type?: string;
  options: any[];
  compareKey?: string;
  selectedYear: number;
  defaultSelected: string[];
  key:string;
}

const LineChart = (props: Props) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ChartDataType>();

  const [seriesData, setSeriesData] = useState<SeriesConfig[]>();

  const [tableData, setTableData] = useState<any>();

  const [selected, setSelected] = useState<string[]>(props.defaultSelected);

  const getDataByArray = () => {};

  useEffect(() => {
    if (props.intervalData && props.waterSupplyData) {
      const fiscalYearArray = getFiscalYearData(
        props.intervalData,
        props.schemeDetails?.system_date_format
      );

      const newData: ChartDataType = {
        xAxis: fiscalYearArray?.map((item) => {
          return getMonthByLanguageAndScheme(item, props.schemeDetails?.system_date_format);
        }),
        
        total_supply_avg: fiscalYearArray?.map((item) => {
          return (
            props.waterSupplyData?.average?.find((inc) => {
              return +inc.month < 10
                ? +inc.month?.toString()?.replace("0", "") === item
                : +inc.month === item;
            })?.supply_average || 0
          );
          
        }),        
        total_supply: fiscalYearArray?.map((item) => {
          return (
            props.waterSupplyData?.supply?.find((inc) => {
              return +inc.supply_date__month < 10
                ? +inc.supply_date__month?.toString()?.replace("0", "") === item
                : +inc.supply_date__month === item;
            })?.total_supply || 0
          );
        }),
        non_revenue_water: fiscalYearArray?.map((item) => {
          return (
            props.waterSupplyData?.supply?.find((inc) => {
              return +inc.supply_date__month < 10
                ? +inc.supply_date__month?.toString()?.replace("0", "") === item
                : +inc.supply_date__month === item;
            })?.non_revenue_water || 0
            
            // props.waterSupplyData?.supply?.find((inc) => {
            //   return +inc.supply_date__month < 10
            //   ? +inc.supply_date__month?.toString()?.replace("0", "") === item
            //   : +inc.supply_date__month === item;
            // })?.non_revenue_water || 0
            );
          }),
          revenue_water: fiscalYearArray?.map((item) => {
            return (
              props.waterSupplyData?.supply?.find((inc) => {
                return +inc.supply_date__month < 10
                  ? +inc.supply_date__month?.toString()?.replace("0", "") === item
                  : +inc.supply_date__month === item;
              })?.revenue_water || 0
              );
            }),
        };


      setChartData(newData);
    }
  }, [props.waterSupplyData, props.schemeDetails, props.intervalData]);

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
      name: props.options.find((opt) => opt.id === item)?.name || "",
      data: chartData && chartData[item],
      itemStyle: {
        color: props.options.find((opt) => opt.id === item)?.color || "",
      },
    }));



    const tableData = selected.map((item) => ({
      name: props.options.find((opt) => opt.id === item)?.name || "",
      color: props.options.find((opt) => opt.id === item)?.color || "",
      data: chartData && chartData[item],
    }));

    setSeriesData(selectedData);
    setTableData(tableData);
  }, [chartData, selected]);

  console.log(seriesData, "<<<<<newData")


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
          return name?.replace(props.type, "");
        },
        rotate: 25,
      },
    },
    yAxis: {
      type: "value",
    },
    series: seriesData,
  };

  return (
    <div className="row">
      <div className="col-md-9">
        <GeneralChart minHeight={400} options={optionData} />
        {tableData?.length > 0 && props.type && (
          <DataTable years={chartData?.xAxis} key={props.key} tableData={tableData} type={props.type} />
        )}
      </div>
      <div className="col-md-3 chartOptions">
        <h6>Select</h6>
        <p>Visualization Parameters</p>

        <ul>
          {props.options.map((item) => (
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
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  waterSupplyData: state.reportData.waterSupplyData.data,
  incomeExpenseData: state.reportData.incomeExpenseData.data,
  actualCF: state.reportData.actualCumulativeCashFlowData.data,
  expenseCF: state.reportData.expenseCumulativeCashFlowData.data,
  intervalData: state.waterSchemeData.getYearIntervals.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LineChart);
