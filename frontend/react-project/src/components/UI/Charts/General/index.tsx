import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "assets/theme/wonderland";

interface Props {
  options: any;
  minHeight?: number;
}

const GeneralChart = (props: Props) => {
  const myChart = useRef<any>(null);

  useEffect(() => {
    if (
      props.options?.series &&
      props.options?.series instanceof Array &&
      props.options?.series[0] &&
      props.options?.series[0]?.data &&
      props.options?.series[0]?.data instanceof Array &&
      props.options?.series[0]?.data.length > 0
    ) {
      const charts = echarts.init(myChart.current, "westeros");
      charts.clear();
      charts.setOption(props.options);
    } else {
      myChart.current = null;
    }
  }, [props.options]);

  return (
    <>
      {props.options?.series &&
      props.options.series instanceof Array &&
      props.options.series[0] &&
      props.options.series[0].data &&
      props.options.series[0].data instanceof Array &&
      props.options.series[0].data.length > 0 ? (
        <div
          ref={myChart}
          style={{ width: "100%", minHeight: props.minHeight || 500 }}
          key="div"
        ></div>
      ) : (
        <div style={{ width: "100%", minHeight: props.minHeight || 500 }} key="section" className="no-data-chart">
          <h6>No Data Available</h6>
        </div>
      )}
    </>
  );
};

export default GeneralChart;
