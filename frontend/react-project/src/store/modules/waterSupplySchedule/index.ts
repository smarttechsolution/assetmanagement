import { combineReducers } from "redux";
import waterScheduleData from './getWaterSupplySchedule'
import deleteWaterScheduleData from './deleteSupplySchedule'
import postWaterScheduleData from './postSupplySchedule'
import updateWaterScheduleData from './updateSupplySchedule'

const outhReducer = combineReducers({
    waterScheduleData,
    postWaterScheduleData,
    deleteWaterScheduleData,
    updateWaterScheduleData
})

export default outhReducer