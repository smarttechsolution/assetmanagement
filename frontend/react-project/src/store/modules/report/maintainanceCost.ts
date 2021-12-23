import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

export type MaintainanceCostSingleType = {
    labour_cost: number
    date__month: number
    date__year: number
    date_from: number
    date_to: number
    maintenance_date__year: number
    maintenance_date__month: number
    next_action__month: number
    material_cost: number
    replacement_cost: number
    unsegregated_cost: number
    actual_cost_total: number
}


export type MaintainanceCostResponse = {
    "actual_cost": MaintainanceCostSingleType[],
    "expected_cost": MaintainanceCostSingleType[],
}

const apiDetails = Object.freeze(apiList.report.maintainanceCost);

export default function maintainanceCostReducer(state = initialState, action: DefaultAction): DefaultState<MaintainanceCostResponse> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getMaintainanceCostAction = (water_scheme_slug, this_year?: boolean): AppThunk<APIResponseDetail<MaintainanceCostResponse>> => async (dispatch: Dispatch) => {
    const variables = { disableSuccessToast: true, pathVariables: { water_scheme_slug } }
    if (this_year) variables['params'] = { this_year }
    return await initDefaultAction(apiDetails, dispatch, variables);
};