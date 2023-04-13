import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type WaterTarrifsType = {
    day: string
    evening_from_time: string
    evening_to_time: string
    from_day:string
    id:string
    time_from: string
    time_to: string
    supply_belts:string
    to_day: string
    comment: string

}[]

const apiDetails = Object.freeze(apiList.waterSupplySchedule.getWaterSupplySchedule);

export default function getWaterSupplyScheduleReducer(state = initialState, action: DefaultAction): DefaultState<WaterTarrifsType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getWaterSupplyScheduleAction = (lang, water_scheme_slug): AppThunk<APIResponseDetail<WaterTarrifsType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang, water_scheme_slug } });
};