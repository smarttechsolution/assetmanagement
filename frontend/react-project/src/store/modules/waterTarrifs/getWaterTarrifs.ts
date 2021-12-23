import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

type UneBasedType = {
    estimated_paying_connection: any
    id: any
    rate: any
    tariff: any
    unit_from: any
    unit_to: any
}


export type WaterTarrifsType = {
    id: number
    apply_date: string
    terif_type: "Use Based" | "Fixed"
    estimated_paying_connection_household: number
    estimated_paying_connection_institution: number
    rate_for_household: number
    rate_for_institution: number
    used_based_units: UneBasedType[]
}[]

const apiDetails = Object.freeze(apiList.waterTarrif.getWaterTarrifs);

export default function getWaterTarrifsReducer(state = initialState, action: DefaultAction): DefaultState<WaterTarrifsType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getWaterTarrifsAction = (lang, water_scheme_slug, tariff_type?: string): AppThunk<APIResponseDetail<WaterTarrifsType>> => async (dispatch: Dispatch) => {

    const updatedDetails = { disableSuccessToast: true, pathVariables: { lang, water_scheme_slug } }

    if (tariff_type) {
        updatedDetails['params'] = { tariff_type }
    }

    return await initDefaultAction(apiDetails, dispatch, updatedDetails);
};