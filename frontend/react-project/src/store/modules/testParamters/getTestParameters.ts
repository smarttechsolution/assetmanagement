import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type TestParametersType = {
    id: number,
    parameter_name: string
    unit: string
    types: string
    NDWQS_standard: string

}[]

const apiDetails = Object.freeze(apiList.testParameters.getTestParameters);

export default function getTestParametersReducer(state = initialState, action: DefaultAction): DefaultState<TestParametersType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getTestParametersAction = (water_scheme_slug?: string): AppThunk<APIResponseDetail<TestParametersType>> => async (dispatch: Dispatch) => {
    const updatedDetails = { ...apiDetails }
    if (water_scheme_slug) updatedDetails['params'] = { water_scheme_slug }

    return await initDefaultAction(apiDetails, dispatch, updatedDetails);
};