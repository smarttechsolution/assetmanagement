import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


type ResponseData = { 
}

const apiDetails = Object.freeze(apiList.componentLogs.postComponentLogs);

export default function postComponentLogsReducer(state = initialState, action: DefaultAction): DefaultState<ResponseData> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const postComponentLogsAction = (lang, requestData): AppThunk<APIResponseDetail<ResponseData>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { requestData, disableToast: true, pathVariables: { lang } })
}