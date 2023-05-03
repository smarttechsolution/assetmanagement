import { combineReducers } from "redux";
import waterSupplyRecordData from './getWaterSupplyRecord'
import deleteWaterSupplyRecordData from './deleteWaterSupplyRecord'
import postWaterSupplyRecordData from './postWaterSupplyRecord'
import updateWaterSupplyRecordData from './updateWaterSupplyRecord'
<<<<<<< HEAD
=======
import postWaterSupplyRecordA from './postSupplyRecordA'
>>>>>>> ams-final

const waterSupplyReducer = combineReducers({
    waterSupplyRecordData,
    postWaterSupplyRecordData,
    deleteWaterSupplyRecordData,
<<<<<<< HEAD
    updateWaterSupplyRecordData
})

export default waterSupplyReducer
=======
    updateWaterSupplyRecordData,
    postWaterSupplyRecordA,
})

export default waterSupplyReducer;
>>>>>>> ams-final
