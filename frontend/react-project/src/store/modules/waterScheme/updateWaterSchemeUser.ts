import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


// export type TestParametersType = any

type requestData = {  
    name: string,
    phone_number: string, 
    password1: string,
    password2: string,
    role: string,
    // is_care_taker: boolean,
    // general_manager: boolean,
    // Other: boolean
}


const apiDetails = Object.freeze(apiList.waterScheme.updateWaterSchemeUser);

export default function updateWaterSchemeUserReducer(state = initialState, action: DefaultAction): DefaultState<requestData> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const updateWaterSchemeUserAction = (id, requestData: requestData): AppThunk<APIResponseDetail<requestData>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { requestData, disableSuccessToast: true, pathVariables: { id } });
};