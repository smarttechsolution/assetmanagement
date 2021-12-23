import { combineReducers } from "redux";
import getSupplyBeltData from './getWaterSupplyBelts'
import deleteSupplyBelt from './deleteSupplyBelt'
import updateSupplyBelt from './updateSupplyBelt'
import postSupplyBelt from './postSupplyBelt'

const supplyBeltReducer = combineReducers({
    getSupplyBeltData,
    deleteSupplyBelt,
    updateSupplyBelt,
    postSupplyBelt
})

export default supplyBeltReducer