import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

export interface ComponentLogsType {
  id: number;
  component: number;
  maintenance_date: string;
  possible_failure: string;
  maintenance_action: string;
  duration: number;
  cost_total: number;
  labour_cost: number;
  material_cost: number;
  replacement_cost: number;
  componant_picture: number;
  supply_belt: number;
  remarks: string;
  log_type: "Issue" | "Maintenance";
  log_status: boolean;
}
 

const apiDetails = Object.freeze(apiList.componentLogs.getComponentLogs);

export default function getComponentLogsReducer(state = initialState, action: DefaultAction): DefaultState<ComponentLogsType[]> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getComponentLogsAction = (lang): AppThunk<APIResponseDetail<ComponentLogsType[]>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { ...apiDetails, pathVariables: { lang } });
};