import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


type RequestData = {
    id: string
    parameter_name: string
    unit: string
    types: string
    NDWQS_standard: string

}

const apiDetails = Object.freeze(apiList.testParameters.deleteMultipleTestParameters);

export default function deleteMultipleTestParametersReducer(state = initialState, action: DefaultAction): DefaultState<RequestData> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const deleteMultipleTestParametersAction = (ids): AppThunk<APIResponseDetail<RequestData>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true,requestData: ids  });
};