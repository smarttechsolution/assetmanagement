import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type TestParametersType = {
    beneficiary_household: any,
    beneficiary_population: any,
    public_taps: any,
    institutional_connection: any,
    apply_date: any
}

type requestData = any

const apiDetails = Object.freeze(apiList.waterScheme.updateWaterSchemeData);

export default function updateWaterSchemeDataReducer(state = initialState, action: DefaultAction): DefaultState<TestParametersType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const updateWaterSchemeDataAction = (lang, id, requestData: requestData): AppThunk<APIResponseDetail<TestParametersType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { requestData, disableSuccessToast: true, pathVariables: { lang, id } });
};