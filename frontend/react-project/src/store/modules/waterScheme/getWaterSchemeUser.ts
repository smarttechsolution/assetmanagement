import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type YearaIntervalType = {
    id: number
    is_care_taker: boolean
    is_administrative_staff: boolean
    general_manager: boolean
    Other: boolean
    name: string
    phone_number: string
    username: string
}[]

const apiDetails = Object.freeze(apiList.waterScheme.getWaterSchemeUser);

export default function getSchemeUserReducer(state = initialState, action: DefaultAction): DefaultState<YearaIntervalType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getSchemeUserAction = (): AppThunk<APIResponseDetail<YearaIntervalType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true });
};