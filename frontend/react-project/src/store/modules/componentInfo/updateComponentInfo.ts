import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


type RequestData = { 
}

const apiDetails = Object.freeze(apiList.componentInfo.updateComponentInfo);

export default function updateComponentInfoReducer(state = initialState, action: DefaultAction): DefaultState<RequestData> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const updateComponentInfoAction = (lang, id, requestData: RequestData): AppThunk<APIResponseDetail<RequestData>> => async (dispatch: Dispatch) => {
    
    return await initDefaultAction(apiDetails, dispatch, { requestData, pathVariables: { lang, id }, disableToast: true })
}