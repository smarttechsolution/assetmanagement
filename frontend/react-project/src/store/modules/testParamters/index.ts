import { combineReducers } from "redux";
import testParametersData from './getTestParameters'
import updateTestParameters from './updateTestParameters'
import postTestParameters from './postTestParameters'
import deleteTestParameters from './deleteTestParameters'
import deleteMultipleTestParameters from './deleteMultipleTestParameters'

const testParametersReducer = combineReducers({
    testParametersData,
    postTestParameters,
    updateTestParameters,
    deleteTestParameters,
    deleteMultipleTestParameters,
})

export default testParametersReducer