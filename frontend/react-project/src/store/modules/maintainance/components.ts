import { Component } from "react";
import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type Components = {
    component1: {
        id: number
        name: string
        category: {
            id: number
            name: string
        }
    },
    id: string
    log_type: string
    componant_picture: string
    maintenance_date: string
    possible_failure: string
    maintenance_action:string
    duration: string
    interval_unit: string
    cost_total: number
    labour_cost:number
    material_cost:number
    replacement_cost:number
    remarks: string
    is_const_seggregated: boolean
    log_status: boolean

}


type CompontntsResponse = Components[]

const apiDetails = Object.freeze(apiList.componentCategories.getComponentCategories);

export default function getComponentInfoReducer(state = initialState, action: DefaultAction): DefaultState<CompontntsResponse> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

// export const getComponentInfoAction = (lang): AppThunk<APIResponseDetail<CompontntsResponse>> => async (dispatch: Dispatch) => {
//     return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang } });
// };

export const getComponentInfoAction = (): AppThunk<APIResponseDetail<CompontntsResponse>> => async (dispatch: Dispatch) => {
  const updatedDetails = { ...apiDetails }

  return await initDefaultAction(apiDetails, dispatch, updatedDetails);
};