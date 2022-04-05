import { combineReducers } from "redux";
import waterSupplyRecordData from './getWaterSupplyRecord'
import deleteWaterSupplyRecordData from './deleteWaterSupplyRecord'
import postWaterSupplyRecordData from './postWaterSupplyRecord'
import updateWaterSupplyRecordData from './updateWaterSupplyRecord'

const waterSupplyReducer = combineReducers({
    waterSupplyRecordData,
    postWaterSupplyRecordData,
    deleteWaterSupplyRecordData,
    updateWaterSupplyRecordData
})

export default waterSupplyReducer