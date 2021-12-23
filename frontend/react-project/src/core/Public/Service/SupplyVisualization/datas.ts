const allTimeOptions = [
    {
        id: "total_supply_avg",
        name: "Yearly Average Line",
        color: "rgb(0,256,136)",
    },
    { id: "total_supply", name: "Total Supply", color: "rgb(255,77,77)" },
    { id: "non_revenue_water", name: "Non revenue water", color: "rgb(77,77,255)" },
]
const thisYearOptions = [
    {
        id: "total_supply_avg",
        name: "Monthly Average Line",
        color: "rgb(0,256,136)",
    },
    { id: "total_supply", name: "Total Supply", color: "rgb(255,77,77)" },
    // { id: "non_revenue", name: "Non revenue water", color: "rgb(77,77,255)" },
]
const thisMonthOptions = [
    { id: "total_supply", name: "Total Supply", color: "rgb(65,148,219)", type: 'bar' },
    { id: "daily_target", name: "Daily Target", color: "rgb(148,25,219)", type: 'line' },
]

const thisWeekOptions = [
    {
        id: "total_supply_avg",
        name: "Daily Average Line",
        color: "rgb(0,256,136)",
    },
    { id: "total_supply", name: "Total Supply", color: "rgb(255,77,77)" },
    // { id: "non_revenue", name: "Non revenue water", color: "rgb(77,77,255)" },
]

export { allTimeOptions, thisYearOptions, thisMonthOptions, thisWeekOptions }