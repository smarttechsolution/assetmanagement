import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

type UseBasedType = {
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
    used_based_units: UseBasedType[]
}[]

const apiDetails = Object.freeze(apiList.waterTarrif.getUseBasedWaterTarrifs);

export default function getUseBasedWaterTarrifsReducer(state = initialState, action: DefaultAction): DefaultState<WaterTarrifsType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getUseBasedWaterTarrifsAction = (lang, water_scheme_slug): AppThunk<APIResponseDetail<WaterTarrifsType>> => async (dispatch: Dispatch) => {

    const updatedDetails = { disableSuccessToast: true, pathVariables: { lang, water_scheme_slug }, params: { tariff_type: "use" } }
    return await initDefaultAction(apiDetails, dispatch, updatedDetails);
};