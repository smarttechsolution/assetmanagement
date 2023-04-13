import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type DashboardComponentInfoType = {
    component: {
        id: number
        name: string
        category: {
            id: number
            name: string
        }
    },
    id: string
    possible_failure: string
    description: string
    maintenance_cost: number
    maintenance_action: string
    next_action: string
    mitigation: string
    componant_picture: string
    resulting_risk_score: number
    maintenance_interval: number
    log_entry: number
    responsible: string
    impact_of_failure: string
    possibility_of_failure: string
    seggregated_or_unseggregated_cost: string
    interval_unit: string

}


type DashboardCompontntResponse = DashboardComponentInfoType[]

const apiDetails = Object.freeze(apiList.maintainance.dashboardComponentInfo);

export default function getDashboardComponentInfoReducer(state = initialState, action: DefaultAction): DefaultState<DashboardCompontntResponse> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getDashboardComponentInfoAction = (lang, water_scheme_slug): AppThunk<APIResponseDetail<DashboardCompontntResponse>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang, water_scheme_slug } });
};