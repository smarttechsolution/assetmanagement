import { combineReducers } from "redux";
import getOtherExpenseData from './getOtherExpenses'
import updateTestParameters from './updateOtherExpenses'
import postTestParameters from './postOtherExpenses'
import deleteTestParameters from './deleteOtherExpenses'

const testParametersReducer = combineReducers({
    getOtherExpenseData,
    postTestParameters,
    updateTestParameters,
    deleteTestParameters
})

export default testParametersReducer