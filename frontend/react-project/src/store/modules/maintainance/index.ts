import { combineReducers } from "redux"; 
import dashboardComponentInfoData from './dashboardComponentInfo';
import componentsData from './components';

const waterSchemeReducer = combineReducers({ 
    dashboardComponentInfoData,
    componentsData
})

export default waterSchemeReducer