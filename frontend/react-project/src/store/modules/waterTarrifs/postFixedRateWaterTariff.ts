import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type WaterTarrifsType = any

const apiDetails = Object.freeze(apiList.waterTarrif.postFixedRateBasedTarrifsRate);

export default function postFixedRateWaterTariffReducer(state = initialState, action: DefaultAction): DefaultState<WaterTarrifsType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const postFixedRateWaterTariffAction = (lang, requestData, params): AppThunk<APIResponseDetail<WaterTarrifsType>> => async (dispatch: Dispatch) => {
    const updatedDetails = { disableSuccessToast: true, pathVariables: { lang }, requestData, params }
    return await initDefaultAction(apiDetails, dispatch, updatedDetails);
};
