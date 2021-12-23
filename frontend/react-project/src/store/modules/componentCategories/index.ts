import { combineReducers } from "redux";
import getComponentCategories from './getComponentCategories'
import updateComponentCategories from './updateComponentCategories'
import postComponentCategories from './postComponentCategories'
import deleteComponentCategories from './deleteComponentCategories'

const testParametersReducer = combineReducers({
    getComponentCategories,
    updateComponentCategories,
    postComponentCategories,
    deleteComponentCategories
})

export default testParametersReducer