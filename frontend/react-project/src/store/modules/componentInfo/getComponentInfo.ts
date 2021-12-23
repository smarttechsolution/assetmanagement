import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

export interface ComponentInfoType {
  component: Component;
  id: number;
  possible_failure: string;
  description: string;
  component_numbers: number;
  maintenance_cost: number;
  maintenance_action: string;
  next_action: string;
  mitigation: string;
  componant_picture?: any;
  resulting_risk_score: number;
  maintenance_interval: number;
  log_entry: number;
  responsible: string;
  impact_of_failure: string;
  possibility_of_failure: string;
  apply_date: string;
}

interface Component {
  id: number;
  name: string;
  category: Category;
}

interface Category {
  id: number;
  name: string;
}

 

const apiDetails = Object.freeze(apiList.componentInfo.getComponentInfo);

export default function getComponentInfoReducer(state = initialState, action: DefaultAction): DefaultState<ComponentInfoType[]> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getComponentInfoAction = (lang): AppThunk<APIResponseDetail<ComponentInfoType[]>> => async (dispatch: Dispatch) => {
    const updatedDetails = { ...apiDetails }

    return await initDefaultAction(apiDetails, dispatch, { ...apiDetails, pathVariables: { lang } });
};