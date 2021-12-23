import { combineReducers } from "redux";
import incomeExpenseData from './incomeExpense'
import maintainanceCostData from './maintainanceCost'
import actualCumulativeCashFlowData from './actualCumilitiveCashFlow'
import expenseCumulativeCashFlowData from './expenseCumilitiveCashFlow'
import incomeByCategoryData from './incomeByCategory'
import expenseByCategoryData from './expenseByCategory'
import waterSupplyData from './waterSupply'
import waterTestResultsData from './waterTestResults'
import maintainanceCostByYearData from './maintainanceCostByYear'

const outhReducer = combineReducers({
    incomeExpenseData,
    maintainanceCostData,
    maintainanceCostByYearData,
    actualCumulativeCashFlowData,
    expenseCumulativeCashFlowData,
    incomeByCategoryData,
    expenseByCategoryData,
    waterSupplyData,
    waterTestResultsData
})

export default outhReducer