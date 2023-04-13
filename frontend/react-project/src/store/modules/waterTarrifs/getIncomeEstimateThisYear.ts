import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

type UneBasedType = {
    unit: number
    unit_from: number
    unit_to: number
    estimated_paying_connection: number
    rate: number
    income: number
    income_total: number
}

export type IncomeEstimates = {
    use_base: UneBasedType[],
    beneficiary_household: number
    total_income: number;
    estimated_paying_connection_household: number;
    rate_for_household: number;
    estimated_paying_connection_institution: number;
    rate_for_institution: number;
    estimated_paying_connection_public: number;
    rate_for_public: number;
    estimated_paying_connection_commercial: number;
    rate_for_commercial: number;
    household_connection: number;
    institutional_connection: number;
    public_connection: number;
    commercial_connection: number;
    total_connection: number;
    other_income: number;
    income: number;
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
