import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type TestParametersType = {
    daily_target: 0
    id: 1
    location: "baneshwor"
    scheme_name: "Test scheme"
    slug: "test-scheme"
    system_built_date: "2021-08-17T01:29:43Z"
    system_operation_from: "2020-03-17T01:29:48Z"
    system_operation_to: "2028-08-17T01:29:50Z"
}

type requestData = any

const apiDetails = Object.freeze(apiList.waterScheme.updateSchemeDetails);

export default function updateWaterSchemeDetailsReducer(state = initialState, action: DefaultAction): DefaultState<TestParametersType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const updateWaterSchemeDetailsAction = (lang,slug, requestData: requestData): AppThunk<APIResponseDetail<TestParametersType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { requestData, disableSuccessToast: true, pathVariables: {lang, slug } });
};