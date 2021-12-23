import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type TestParametersType = {
    daily_target: number
    id: number
    location: string
    period: number
    scheme_name: string
    slug: string
    system_built_date: string
    system_date_format: string
    system_operation_from: string
    system_operation_to: string
    tool_start_date: string 
    currency: string 
    water_source: any[]
}

const apiDetails = Object.freeze(apiList.waterScheme.getSchemeDetails);

export default function getWaterSchemeDetailsReducer(state = initialState, action: DefaultAction): DefaultState<TestParametersType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getWaterSchemeDetailsAction = (slug): AppThunk<APIResponseDetail<TestParametersType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { slug } });
};