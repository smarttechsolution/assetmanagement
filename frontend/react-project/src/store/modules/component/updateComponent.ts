import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


type Response = { 
}

const apiDetails = Object.freeze(apiList.component.updateComponent);

export default function updateComponentReducer(state = initialState, action: DefaultAction): DefaultState<Response> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const updateComponentAction = (id, requestData): AppThunk<APIResponseDetail<Response>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { requestData, pathVariables: { id}, disableToast: true })
}