import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type SupplyBeltType = {
    belt_type: string
    beneficiary_household: number
    beneficiary_population: number
    id: number
    institutional_connection: number
    name: string
    public_taps: number

}[]

const apiDetails = Object.freeze(apiList.supplyBelts.getsupplyBelts);

export default function getSupplyBeltsReducer(state = initialState, action: DefaultAction): DefaultState<SupplyBeltType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getSupplyBeltsAction = (lang, water_scheme_slug): AppThunk<APIResponseDetail<SupplyBeltType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang, water_scheme_slug } });
};