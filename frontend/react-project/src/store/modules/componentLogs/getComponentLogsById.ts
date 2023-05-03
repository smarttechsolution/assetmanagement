import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type componentLogsById = {
    "component": number
    "id": number
    "possible_failure": string
    "component_numbers": number
    "description": string
    "maintenance_cost": number
    "labour_cost": number
    "material_cost": number
    "replacement_cost": number
    "maintenance_action": string
    "supply_belt": number
    "maintenance_interval": number
    "impact_of_failure": string
    "possibility_of_failure": string
    "resulting_risk_score": number
    "mitigation": string
    "responsible": string
    "next_action": string
    "componant_picture": number
    "log_entry": number
    "possible_total_logs": number
    "existing_logs": [],
    "estimated_cost": number
    "apply_date": string
    "main_component": string
    "log_status": boolean
}

const apiDetails = Object.freeze(apiList.componentLogs.getComponentLogById);

export default function getComponentLogsByIdReducer(state = initialState, action: DefaultAction): DefaultState<componentLogsById> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getComponentLogsByIdAction = (lang, id): AppThunk<APIResponseDetail<componentLogsById>> => async (dispatch: Dispatch) => {
    const updatedDetails = { ...apiDetails, }

    return await initDefaultAction(apiDetails, dispatch, { ...updatedDetails, pathVariables: { lang, id } });
};