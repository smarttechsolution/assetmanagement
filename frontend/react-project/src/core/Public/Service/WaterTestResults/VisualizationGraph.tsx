import GeneralChart from "components/UI/Charts/General";
import CustomCheckBox from "components/UI/CustomCheckbox";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { TestParametersType } from "store/modules/testParamters/getTestParameters";
import { RootState } from "store/root-reducer";
import { chartConfig } from "./configData";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import { getNumberByLanguage } from "i18n/i18n";

type SeriesConfig = {
  name: string;
  type: string;
  smooth: boolean;
  data: (string | number)[];
};

type ChartDataType = {
  xAxis: (string | number)[];
  // yAxis: string;
};

interface Props extends PropsFromRedux {
  type?: string;
  compareKey: string;
  defaultSelected: number[];
  setSelectedGlobal: Function;
  selectedValues: object;
  setSelectedValuesGLobal: Function;
}

const LineChart = (props: Props) => {


  const [testParams, setTestParams] = useState<{
    chemical: TestParametersType;
    physical: TestParametersType;
    others: TestParametersType;
  }>();


  const { t } = useTranslation();

  const [selected, setSelected] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartDataType>();
  const [units, setUnits] = useState<any>();

  const [seriesData, setSeriesData] = useState<SeriesConfig[]>();
  const [otherSeriesData, setOtherSeriesData] = useState<any[]>();
  const [PhysicalSeriesData, setPhysicalSeriesData] = useState<any[]>();

  const [categoryOption, setCategoryOptions] = React.useState<OptionType[]>();


  const [selectedItem, setSelectedItem] = useState<any>({});
  const [islegend, setIsLegend] = React.useState<any>();

  useEffect(() => {
    if (props.testParams) {
      const params = {
        chemical: props.testParams.filter((item) => item.types === "Chemical"),
        physical: props.testParams.filter((item) => item.types === "Physical"),
        others: props.testParams.filter((item) => item.types === "Others"),
      };
      setTestParams(params);
    }
  }, [props.testParams]);

  useEffect(() => {
    if (props.testResult && props.testResult[0]) {
      const newData: ChartDataType = {
        xAxis: props.testResult.map((item) => `${props.type} ${item[props.compareKey]}`),
        // yAxis: 
      };
      console.log(newData, "CHARTSSSSSSSSSSSS");


      setChartData(newData);
    }
  }, [props.testResult]);

  const handleSelect = (id: number) => {
    if (selected?.includes(id)) {
      const filteredData = selected.filter((item) => item !== id);

      setSelected(filteredData);
    } else {
      setSelected([id]);
    }
  };

  const handleSelectChange = (name, id) => {
    setSelectedItem({
      [name]: id
    });
  }

  React.useEffect(() => {
    if (props.defaultSelected.length) {
      props.defaultSelected.map(handleSelect);
      setSelectedItem(props.selectedValues)
    }
  }, []);


  React.useEffect(() => {
    if (props.testParams) {
      const options = props.testParams?.map((item) => ({
        label: "" + item?.parameter_name,
        value: "" + item?.id,
      }));
      setCategoryOptions(options);
    }
  }, [props.testParams]);


  useEffect(() => {
    let chemicalSeries: any = seriesData;
    let physicalSeries: any = PhysicalSeriesData;
    let otherCharts: any = otherSeriesData;

    // console.log({selected});
    props.setSelectedGlobal(selected);
    props.setSelectedValuesGLobal(selectedItem);


    selected.forEach((item) => {
      const testParam = props.testParams?.find((param) => param.id === item);
      console.log(testParam, "TEST PAEAM");

      if (testParam?.types === "Chemical") {
        setUnits(testParam?.unit);
      }

      if (testParam?.types === "Chemical") {
        chemicalSeries = [];
        // setIsLegend(testParam?.parameter_name + ` ( ${testParam?.unit} ) (${t("home:standard")} ${testParam?.NDWQS_standard})`)
        setIsLegend(testParam?.parameter_name + ` ( ${testParam?.unit} ) `)

        const chData = props.testResult.map((item) => {
          return (
            item.data?.find(
              (single) => single.parameter__parameter_name === testParam?.parameter_name
            )?.total_value || 0
          );
        })


        chemicalSeries.push({
          name: testParam?.parameter_name + ` ( ${testParam?.unit} ) `,
          type: "line",
          smooth: true,
          data: chData,
        });

        //ndwqs1
        if (testParam?.ndwqs2) {
          chemicalSeries.push({
            name: `${t("home:standard")} Min`,
            type: "line",
            smooth: true,
            color: 'rgb(255,192,203)',
            data: Array(chData.length).fill(testParam.ndwqs1)
          });
        } else {
          chemicalSeries.push({
            name: `${t("home:standard")}`,
            type: "line",
            smooth: true,
            // color: 'rgb(255,192,203)',
            color: 'rgba(  173, 197, 74 )',
            data: Array(chData.length).fill(testParam.ndwqs1)
          });
        }

        //ndwqs2
        if (testParam?.ndwqs2 != null) {
          chemicalSeries.push({
            name: `${t("home:standard")} Max`,
            type: "line",
            smooth: true,
            // color: 'rgb(255,192,203)',
            color: 'rgba(  173, 197, 74 )',
            data: Array(chData.length).fill(testParam.ndwqs2)
          });
        }
      }
      else if (testParam?.types === "Physical") {
        physicalSeries = [];

        const chData = props.testResult.map((item) => {
          return (
            item.data?.find(
              (single) => single.parameter__parameter_name === testParam?.parameter_name
            )?.total_value || 0
          );
        });

        if (testParam?.ndwqs2) {
          var phyStandard = {
            name: `${t("home:standard")} Min`,
            type: "line",
            smooth: true,
            data: Array(chData.length).fill(testParam.ndwqs1),
            color: 'rgba(  173, 197, 74 )'
            // color: 'rgb(255,192,203)',
            
          }
        } else {
          phyStandard = {
            name: `${t("home:standard")}`,
            type: "line",
            smooth: true,
            data: Array(chData.length).fill(testParam.ndwqs1),
            // color: 'rgba(  173, 197, 74 )'
            color: 'rgb(255,192,203)',
          }
        }


        if (testParam?.ndwqs2 != null) {
          var ndwqstandard2 = {
            name: `${t("home:standard")} Max`,
            type: "line",
            smooth: true,
            data: Array(chData.length).fill(testParam.ndwqs2),
            color: 'rgba(  173, 197, 74 )'
            // color: 'rgb(255,192,203)',
          }
        } else {
          ndwqstandard2 = {
            name: "",
            type: "",
            smooth: true,
            data: [],
            color: ''
          }
        }

        const newChart = Object.assign(
          {},
          {
            // ...chartConfig,
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow",
              },
              // formatter: '{b}<br />{a}: {c}'
            },
            legend: {
              show: true,
              bottom: 0,
              testParam: {
                color: "red"
              },
              // data: [testParam?.parameter_name + ` ( ${testParam?.unit} ) (${t("home:standard")} ${testParam?.NDWQS_standard}) `]
            },
            grid: {
              left: "3%",
              right: "5%",
              bottom: "10%",
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
              },
            },
            yAxis: {
              type: 'value',
              name: testParam.unit,
              nameRotate: 90,
              nameLocation: "middle",
              nameGap: 32,
            },

            series: [
              {
                name: testParam?.parameter_name + ` ( ${testParam?.unit} )`,
                type: "line",
                smooth: true,
                data: chData,
                color: 'rgb( 58, 49, 63 )'
              },
              phyStandard,
              // {
              //   name: `${t("home:standard")} ${getNumberByLanguage(1)}`,
              //   type: "line",
              //   smooth: true,
              //   data: Array(chData.length).fill(testParam.ndwqs1),
              //   color: 'rgba(  173, 197, 74 )'
              // },
              ndwqstandard2,

            ],
          }
        );
        physicalSeries.push(newChart);
      }
      else {
        otherCharts = [];
        const chData = props.testResult.map((item) => {
          return (
            item.data?.find(
              (single) => single.parameter__parameter_name === testParam?.parameter_name
            )?.total_value || 0
          );
        });

        if (testParam?.ndwqs2) {
          var otherStandard1 = {
            name: `${t("home:standard")} Min`,
            type: "line",
            smooth: true,
            data: Array(chData.length).fill(testParam?.ndwqs1),
            // color: 'rgba(82, 190, 128)'
            color: 'rgb(255,192,203)',
          }
        } else {
          otherStandard1 = {
            name: `${t("home:standard")}`,
            type: "line",
            smooth: true,
            data: Array(chData.length).fill(testParam?.ndwqs1),
            // color: 'rgba(82, 190, 128)'
            color: 'rgb(255,192,203)',
          }
        }

        if (testParam?.ndwqs2 != null) {
          var otherStandard2 = {
            name: `${t("home:standard")} Max`,
            type: "line",
            smooth: true,
            data: Array(chData.length).fill(testParam.ndwqs2),
            color: 'rgba(  173, 197, 74 )'
            // color: 'rgba(82, 190, 128)'
            // color: 'rgb(255,192,203)',
          }
        } else {
          otherStandard2 = {
            name: "",
            type: "",
            smooth: true,
            data: [],
            color: ''
          }
        }

        const newChart = Object.assign(
          {},
          {
            // ...chartConfig,
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow",
              },
              // formatter: '{b}<br />{a}: {c}'
            },
            legend: {
              show: true,
              bottom: 0,
              // testParam: {
              //   color: "red"
              // },
              // data: [testParam?.parameter_name + ` ( ${testParam?.unit} ) (${t("home:standard")} ${testParam?.NDWQS_standard}) `]
            },
            grid: {
              left: "3%",
              right: "5%",
              bottom: "10%",
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
              },
            },
            yAxis: {
              type: 'value',
              name: testParam?.unit,
              nameRotate: 90,
              nameLocation: "middle",
              nameGap: 32,
            },

            series: [
              {
                name: testParam?.parameter_name + ` ( ${testParam?.unit} ) `,
                type: "line",
                smooth: true,
                data: chData,
                // color: 'rgba(245, 176, 65)'
              },
              otherStandard1,
              // {
              //   name: `${t("home:standard")} ${getNumberByLanguage(1)}`,
              //   type: "line",
              //   smooth: true,
              //   data: Array(chData.length).fill(testParam?.ndwqs1),
              //   color: 'rgba(82, 190, 128)'
              // },
              otherStandard2
              // {
              //   // name: `${t("home:standard")} ${getNumberByLanguage(2)}`,
              //   // type: "line",
              //   // smooth: true,
              //   // data: Array(chData.length).fill(testParam?.ndwqs2),
              //   // color: 'rgba(  173, 197, 74 )'
              // },
            ],
          }
        );
        otherCharts.push(newChart);
      }
    });
    setSeriesData(chemicalSeries);
    setPhysicalSeriesData(physicalSeries);
    setOtherSeriesData(otherCharts);

    // const selectedData = selected.map((item) => ({
    //   ...config,
    //   name: props.options.find((opt) => opt.id === item)?.name || "",
    //   data: chartData && chartData[item],
    //   itemStyle: {
    //     color: props.options.find((opt) => opt.id === item)?.color || "",
    //   },
    // }));
    // const tableData = selected.map((item) => ({
    //   name: props.options.find((opt) => opt.id === item)?.name || "",
    //   color: props.options.find((opt) => opt.id === item)?.color || "",
    //   data: chartData && chartData[item],
    // }));
    // setSeriesData(selectedData);
    // setTableData(tableData);
  }, [chartData, selected]);


  const chemicalSeriesOptionData = {

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      // formatter: '{b}<br />{a}: {c}'
    },
    legend: {
      show: true,
      bottom: 0,
      // data: [islegend]
    },
    grid: {
      left: "3%",
      right: "5%",
      bottom: "10%",
      //   top: "6%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: chartData?.xAxis,
      axisLabel: {
        formatter: function (name) {
          return name?.replace(props.type, "", "");
        },
      },
    },
    yAxis: {
      type: 'value',
      name: units,
      nameRotate: 90,
      nameLocation: "middle",
      nameGap: 32,
    },
    series: seriesData,
  };

  console.log({
    chemicalSeriesOptionData,
    PhysicalSeriesData,
    otherSeriesData
  });

  const RenderPhysical = () => {
    console.log("RENDER PHYSICAL SERIES", PhysicalSeriesData);

    return <div>
      {PhysicalSeriesData && PhysicalSeriesData.map((item, key) => (
        <div className="mt-1" key={key}>
          {" "}
          <GeneralChart minHeight={400} options={item} /> {" "}
        </div>
      ))
      }
    </div>
  }

  const RenderOther = () => {
    console.log("RENDER PHYSICAL SERIES", otherSeriesData);

    return <div>
      {otherSeriesData && otherSeriesData.map((item, key) => (
        <div className="mt-1" key={key}>
          {" "}
          <GeneralChart minHeight={400} options={item} /> {" "}
        </div>
      ))
      }
    </div>
  }

  const handleChart = (props) => {
    try {
      const testParam = props.testParams?.filter((item) => item.types === "Chemical");
      const testParamPhy = props.testParams?.filter((param) => param.types === "Physical");
      const testParamOth = props.testParams?.filter((param) => param.types === "Others");

      const testChemical = testParam?.map((item) => item.id)
      const testPhysical = testParamPhy?.map((item) => item.id)
      const testOther = testParamOth?.map((item) => item.id)

      if (testChemical.includes(selected[0])) {
        console.log("CHEMICALSERIES", chemicalSeriesOptionData)
        return <div>
          <div>
            <div className="mt-1">
              <GeneralChart minHeight={400} options={chemicalSeriesOptionData} />
            </div>
          </div>
        </div>
      } else if (testPhysical.includes(selected[0])) {
        console.log(PhysicalSeriesData, "PHYSICALSERIES")
        return <div>
          {RenderPhysical()}
        </div>
      } else if (testOther.includes(selected[0])) {
        console.log(otherSeriesData, "OTHER SERIES DATA");
        return <div >
          {RenderOther()}
        </div>
      }
      else {
        return <div>
          <GeneralChart minHeight={400} options={chemicalSeriesOptionData} />
        </div>
      }

    } catch (error) {
      console.log(error, "************************")
      return <div>
        <GeneralChart minHeight={400} options={chemicalSeriesOptionData} />
      </div>
    }

  }

  return (
    <div className="row">
      <div className="col-md-9">
        {handleChart(props)}
      </div>
      < div className="col-md-3 chartOptions" >
        <h6>Select </h6>

        < p className="text-capitalize mt-3 mb-1" > Chemical </p>
        {
          testParams && Object.keys(testParams?.chemical).map((type, index) => {
            if (index !== 0) return null;

            const options = testParams?.chemical.map(item => ({ label: item.parameter_name, value: item.id, id: item.id }));

            const values = options.filter(item => selectedItem[type] === item.id);
            return <div key={type}>
              <StyledSelect
                id={"Select" + type}
                userCustomOption={true}
                options={options}
                name={type}
                value={values}
                onChange={(e: any) => {
                  handleSelectChange(e?.name, e?.value.id);
                  handleSelect(e?.value?.id)
                }
                }
              />
            </div>
          })}

        <p className="text-capitalize mt-3 mb-1" > Physical </p>
        {
          testParams && Object.keys(testParams?.physical).map((type, index) => {
            // console.log(type, 's====================================s');
            if (index !== 0) return null;

            const options = testParams?.physical.map(item => ({ label: item.parameter_name, value: item.id, id: item.id }));

            const values = options.filter(item => selectedItem[type] === item.id);
            return <div key={type}>
              <StyledSelect
                id={"Select" + type}
                userCustomOption={true}
                options={options}
                name={type}
                value={values}
                onChange={(e: any) => {
                  handleSelectChange(e?.name, e?.value.id);
                  handleSelect(e?.value?.id)
                }
                }
              />
            </div>
          })}


        <p className="text-capitalize mt-3 mb-1" > Others </p>
        {
          testParams && Object.keys(testParams?.others).map((type, index) => {
            // console.log(type, 's====================================s');
            if (index !== 0) return null;

            const options = testParams?.others.map(item => ({ label: item.parameter_name, value: item.id, id: item.id }));

            const values = options.filter(item => selectedItem[type] === item.id);
            return <div key={type}>
              <StyledSelect
                id={"Select" + type}
                userCustomOption={true}
                options={options}
                name={type}
                value={values}
                onChange={(e: any) => {
                  handleSelectChange(e?.name, e?.value.id);
                  handleSelect(e?.value?.id)
                }
                }
              />
            </div>
          })}
      </div>
    </div>
  )
}
const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  testParams: state.testParamtersData.testParametersData.data,
  testResult: state.reportData.waterTestResultsData.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LineChart);