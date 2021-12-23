import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


type RequestData = { 
}

const apiDetails = Object.freeze(apiList.supplyBelts.postsupplyBelts);

export default function postSupplyBeltReducer(state = initialState, action: DefaultAction): DefaultState<RequestData> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const postSupplyBeltAction = (lang, requestData): AppThunk<APIResponseDetail<RequestData>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { requestData, disableToast: true, pathVariables: { lang } })
}