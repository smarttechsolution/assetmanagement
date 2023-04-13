import { combineReducers } from "redux";
import waterSupplyRecordData from './getWaterSupplyRecord'
import deleteWaterSupplyRecordData from './deleteWaterSupplyRecord'
import postWaterSupplyRecordData from './postWaterSupplyRecord'
import updateWaterSupplyRecordData from './updateWaterSupplyRecord'
import postWaterSupplyRecordA from './postSupplyRecordA'

const waterSupplyReducer = combineReducers({
    waterSupplyRecordData,
    postWaterSupplyRecordData,
    deleteWaterSupplyRecordData,
    updateWaterSupplyRecordData,
    postWaterSupplyRecordA,
})

export default waterSupplyReducer;