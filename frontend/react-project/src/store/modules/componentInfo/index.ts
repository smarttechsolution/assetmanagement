import { combineReducers } from "redux";
import getComponentInfo from './getComponentInfo'
import getComponentInfoById from './getComponentInfoById'
import updateComponentInfo from './updateComponentInfo'
import postComponentInfo from './postComponentInfo'
import deleteComponentInfo from './deleteComponentInfo'

const testParametersReducer = combineReducers({
    getComponentInfo,
    getComponentInfoById,
    updateComponentInfo,
    postComponentInfo,
    deleteComponentInfo
})

export default testParametersReducer