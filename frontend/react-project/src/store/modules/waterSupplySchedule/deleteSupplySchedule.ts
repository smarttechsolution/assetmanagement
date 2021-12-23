import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type WaterTarrifsType = {
    evening_from_time: string
    evening_to_time: string
    from_day: string
    id: string
    morning_from_time: string
    morning_to_time: string
    supply_belts: string
    to_day: string

}[]

const apiDetails = Object.freeze(apiList.waterSupplySchedule.deleteWaterSupplySchedule);

export default function deleteWaterSupplyScheduleReducer(state = initialState, action: DefaultAction): DefaultState<WaterTarrifsType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const deleteWaterSupplyScheduleAction = (lang, id): AppThunk<APIResponseDetail<WaterTarrifsType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang, id } });
};