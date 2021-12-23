import { combineReducers } from "redux";
import waterTarrifData from './getWaterTarrifs'
import postUseBasedWaterTariff from './postUseBasedWaterTariff'
import updateUseBasedWaterTariff from './updateUseBasedWaterTariff'
import deleteWaterTariff from './deleteWaterTariff'
import postFixedRateWaterTariff from './postFixedRateWaterTariff'
import getIncomeEstimateThisYear from './getIncomeEstimateThisYear'
import deleteUseBasedWaterTariff from './deleteUseBasedWaterTariff'
import getUseBasedWaterTarrifs from './getUseBasedWaterTarrifs'

const outhReducer = combineReducers({
    waterTarrifData,
    postUseBasedWaterTariff,
    updateUseBasedWaterTariff,
    deleteWaterTariff,
    postFixedRateWaterTariff,
    getIncomeEstimateThisYear,
    deleteUseBasedWaterTariff,
    getUseBasedWaterTarrifs
})

export default outhReducer