import { combineReducers } from "redux";
import testParametersData from './getTestParameters'
import updateTestParameters from './updateTestParameters'
import postTestParameters from './postTestParameters'
import deleteTestParameters from './deleteTestParameters'

const testParametersReducer = combineReducers({
    testParametersData,
    postTestParameters,
    updateTestParameters,
    deleteTestParameters
})

export default testParametersReducer