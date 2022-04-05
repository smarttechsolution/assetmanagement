import { combineReducers } from "redux";
import waterSchemeDetailsData from './waterSchemeDetails'
import updateWaterSchemeDetails from './updateWaterSchemeDetails'
import getYearIntervals from './getYearIntervals'
import getWaterSchemeUser from './getWaterSchemeUser'
import postWaterSchemeUser from './postWaterSchemeUser'
import updateWaterSchemeUser from './updateWaterSchemeUser'
import deleteWaterSchemeUser from './deleteWaterSchemeUser'
import deleteWaterSchemeData from './deleteWaterSchemeData'
import postWaterSchemeData from './postWaterSchemeData'
import getWaterSchemeData from './getWaterSchemeData'
import updateWaterSchemeData from './updateWaterSchemeData'

const waterSchemeReducer = combineReducers({
    waterSchemeDetailsData,
    updateWaterSchemeDetails,
    getYearIntervals,
    getWaterSchemeUser,
    postWaterSchemeUser,
    updateWaterSchemeUser,
    deleteWaterSchemeData,
    postWaterSchemeData,
    getWaterSchemeData,
    updateWaterSchemeData,
    deleteWaterSchemeUser
})

export default waterSchemeReducer