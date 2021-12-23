import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

type UneBasedType = {
    unit: number
    estimated_paying_connection: number
    rate: number
    income: number
    income_total: number
}


export type IncomeEstimates = {
    use_base: UneBasedType[],
    total_income: number
    beneficiary_household: number
    institutional_connection: number
    total_connection: number
    public_taps: number
    estimated_paying_connection_household: number
    rate_for_household: number
    estimated_paying_connection_institution: number
    rate_for_institution: number
    other_income: number
}

const apiDetails = Object.freeze(apiList.waterTarrif.incomeEstimateThisYear);

export default function getUsIncomeEstimateThisYearReducer(state = initialState, action: DefaultAction): DefaultState<IncomeEstimates> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getUsIncomeEstimateThisYearAction = (scheme): AppThunk<APIResponseDetail<IncomeEstimates>> => async (dispatch: Dispatch) => {

    const updatedDetails = { disableSuccessToast: true, pathVariables: { scheme } }
    return await initDefaultAction(apiDetails, dispatch, updatedDetails);
};