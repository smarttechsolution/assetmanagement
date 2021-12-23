import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

export type SingleActualCF = {
    cf: number
    date_from: number,
    date_to: number,
    month: number,
    year: number,
}


export type ActualCumulativeCF = {
    "actual_cf": SingleActualCF[],
}

const apiDetails = Object.freeze(apiList.report.actualCumulativeCashFlow);

export default function actualCumulativeCashFlowReducer(state = initialState, action: DefaultAction): DefaultState<ActualCumulativeCF> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getActualCumulativeAction = ( water_scheme_slug, this_year?: boolean): AppThunk<APIResponseDetail<ActualCumulativeCF>> => async (dispatch: Dispatch) => {

    const variables = { disableSuccessToast: true, pathVariables: {  water_scheme_slug } }
    if (this_year) variables['params'] = { this_year }
    return await initDefaultAction(apiDetails, dispatch, variables);
}