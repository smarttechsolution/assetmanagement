const allTimeOptions = [
    { id: "total_supply_avg", name: "Yearly Average Water dispensed from Distribution Tank", color: "rgb(0,256,136)" },
    { id: "total_supply", name: "Water dispensed from Distribution Tank", color: "rgb(255,77,77)" },
    { id: "non_revenue_water", name: "Non revenue water", color: "rgb(77,77,255)" },
    { id: "revenue_water", name: "Revenue water", color: "rgb(133, 193, 233)" },
]
const thisYearOptions = [
    { id: "total_supply_avg", name: "Monthly Average Water dispensed from Distribution Tank", color: "rgb(0,256,136)"},
    { id: "total_supply", name: "Water dispensed from Distribution Tank", color: "rgb(255,77,77)" },
    { id: "non_revenue_water", name: "Non revenue water", color: "rgb(77,77,255)" },
    { id: "revenue_water", name: "Revenue water", color: "rgb(133, 193, 233)" },
]
const thisMonthOptions = [
    { id: "daily_avg", name: "Daily Average Water dispensed from Distribution Tank", color: "rgb(148,25,219)", type: 'line' },
    { id: "total_supply", name: "Water dispensed from Distribution Tank", color: "rgb(65,148,219)", type: 'line' },
    { id: "non_revenue_water", name: "Non revenue water", color: "rgb(77,77,255)" },
    { id: "revenue_water", name: "Revenue water", color: "rgb(133, 193, 233)" },
]

const thisWeekOptions = [
    { id: "total_supply_avg", name: "Daily Average Water dispensed from Distribution Tank", color: "rgb(0,256,136)"},
    { id: "total_supply", name: "Water dispensed from Distribution Tank", color: "rgb(255,77,77)", type: "line"},
    { id: "non_revenue_water", name: "Non revenue water", color: "rgb(77,77,255)", type: "line"},
    { id: "revenue_water", name: "Revenue water", color: "rgb(133, 193, 233)" },
]

export { allTimeOptions, thisYearOptions, thisMonthOptions, thisWeekOptions }