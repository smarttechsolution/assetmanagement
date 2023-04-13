import { combineReducers } from "redux";
import waterSupplyTestData from './getWaterSupplyTest'
import deleteWaterSupplyTestData from './deleteWaterSupplyTest'
import postWaterSupplyTestData from './postWaterSupplyTest'
import updateWaterSupplyTestData from './updateWaterSupplyTest'

const waterSupplyTest = combineReducers({
    waterSupplyTestData,
    postWaterSupplyTestData,
    deleteWaterSupplyTestData,
    updateWaterSupplyTestData
})

export default waterSupplyTest