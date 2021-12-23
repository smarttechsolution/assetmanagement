import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";
 

const apiDetails = Object.freeze(apiList.waterSupplySchedule.updateWaterSupplySchedule);

export default function updateWaterSupplyScheduleReducer(state = initialState, action: DefaultAction): DefaultState<any> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const updateWaterSupplyScheduleAction = (lang, id, requestData): AppThunk<APIResponseDetail<any>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang, id }, requestData });
};