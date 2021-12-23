import { combineReducers } from "redux";
import getComponent from './getComponent'
import updateComponent from './updateComponent'
import postComponent from './postComponent'
import deleteComponent from './deleteComponent'

const testParametersReducer = combineReducers({
    getComponent,
    updateComponent,
    postComponent,
    deleteComponent
})

export default testParametersReducer