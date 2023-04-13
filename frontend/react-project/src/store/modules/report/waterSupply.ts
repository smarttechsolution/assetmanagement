import { Dispatch } from "redux";
import { AppThunk } from "../..";
import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type SingleWaterSupply = {
    "data_count": any
    "date__month": any 
    "date_from": any
    "date_to": any
    "total_supply": any
    // "total_supply_avg": any
    "total_supply_average": any

    "non_revenue_water": any
    "revenue_water": any
    "supply_date__year": any
    "supply_date__month": any
    "supply_date": any
    "daily_avg": any

    /* Only For Year */
    "month": any
    "supply_average": any
}


export type WaterSupplyResultResponse = {
    "supply": SingleWaterSupply[],
    "non_revenue": SingleWaterSupply[]
    "daily_target": number
    "daily_avg": { "daily_avg": number }
    "average" : SingleWaterSupply[],

}

const apiDetails = Object.freeze(apiList.report.waterSupply);

export default function waterSupplyReducer(state = initialState, action: DefaultAction): DefaultState<WaterSupplyResultResponse> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getWaterSupplyReportAction = (water_scheme_slug, queryParams?: any): AppThunk<APIResponseDetail<WaterSupplyResultResponse>> => async (dispatch: Dispatch) => {
    let updatedDetails = { ...apiDetails }
    updatedDetails.controllerName = `${updatedDetails.controllerName 
        ?.replace("{water_scheme_slug}", water_scheme_slug)}${queryParams ? `?${queryParams}` : ``}`

    return await initDefaultAction(updatedDetails, dispatch, { disableSuccessToast: true, pathVariables: { water_scheme_slug } });
};