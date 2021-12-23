import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

export type MaintainanceCostByYear = {
    all_time_actual_cost_total: number
    all_time_expected_cost_total: number
    this_year_actual_cost_total: number
    this_year_expected_cost_total: number
    cost_total__sum: number
    labour_cost__sum: number
    material_cost__sum: number
    replacement_cost__sum: number
    unsegregated_cost: number

}


export type MaintainanceCostByYearResponse = {
    "all_time_actual_cost": MaintainanceCostByYear,
    "all_time_expected_cost": MaintainanceCostByYear,
    "this_year_actual_cost": MaintainanceCostByYear,
    "this_year_expected_cost": MaintainanceCostByYear,
}

const apiDetails = Object.freeze(apiList.report.maintainanceCostByYear);

export default function maintainanceCostByYearReducer(state = initialState, action: DefaultAction): DefaultState<MaintainanceCostByYearResponse> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getMaintainanceCostByYearAction = (water_scheme_slug, this_year?: boolean): AppThunk<APIResponseDetail<MaintainanceCostByYearResponse>> => async (dispatch: Dispatch) => {
    const variables = { disableSuccessToast: true, pathVariables: { water_scheme_slug } }
    if (this_year) variables['params'] = { this_year }
    return await initDefaultAction(apiDetails, dispatch, variables);
};