import { combineReducers } from "redux";
import getComponentLogs from './getComponentLogs'
// import getComponentLogsById from './getComponentLogsById'
import updateComponentLogs from './updateComponentLogs'
import postComponentLogs from './postComponentLogs'
import deleteComponentLogs from './deleteComponentLogs'
import getComponentLogsById from './getComponentLogsById'

const componentLogsReducer = combineReducers({
    getComponentLogs,
    // getComponentLogsById,
    updateComponentLogs,
    postComponentLogs,
    deleteComponentLogs,
    getComponentLogsById
})

export default componentLogsReducer