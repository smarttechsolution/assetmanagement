const chartConfig = {
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
        // data: [],
        // axisLabel: {
        //     formatter: function (name) {
        //         return name?.replace(props.type, "");
        //     },
        // },
    },
    yAxis: {
        type: "value",
    },
    series: [],
};

export { chartConfig }