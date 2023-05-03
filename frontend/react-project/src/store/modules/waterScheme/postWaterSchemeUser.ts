import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type UserType = any
type requestData = { 
    name: string,
    phone_number: string, 
    password1: string,
    password2: string,
    role: string,
}


const apiDetails = Object.freeze(apiList.waterScheme.postWaterSchemeUser);

export default function postWaterSchemeUserReducer(state = initialState, action: DefaultAction): DefaultState<UserType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const postWaterSchemeUserAction = (requestData: requestData): AppThunk<APIResponseDetail<UserType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { requestData, disableSuccessToast: true });
};