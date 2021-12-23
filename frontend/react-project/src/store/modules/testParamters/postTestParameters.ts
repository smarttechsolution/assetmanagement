import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


type RequestData = {
    parameter_name: string
    unit: string 
    NDWQS_standard: string
    types: string

}

const apiDetails = Object.freeze(apiList.testParameters.postTestParameters);

export default function postTestParametersReducer(state = initialState, action: DefaultAction): DefaultState<RequestData> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const postTestParametersAction = (requestData: RequestData): AppThunk<APIResponseDetail<RequestData>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { requestData, disableToast: true })
}