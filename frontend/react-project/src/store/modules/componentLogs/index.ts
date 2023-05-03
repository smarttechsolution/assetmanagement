import { combineReducers } from "redux";
import getComponentLogs from './getComponentLogs'
import updateComponentLogs from './updateComponentLogs'
import postComponentLogs from './postComponentLogs'
import deleteComponentLogs from './deleteComponentLogs'
import getComponentLogsById from './getComponentLogsById'

const componentLogsReducer = combineReducers({
    getComponentLogs,
    updateComponentLogs,
    postComponentLogs,
    deleteComponentLogs,
    getComponentLogsById
})

export default componentLogsReducer