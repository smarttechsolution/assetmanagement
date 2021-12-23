import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type SingleIncome = {
    category__name: string
    total_amount: number

}


export type IncomeExpenseResponse = {
    "income_all_time": SingleIncome[],
    "income_this_year": SingleIncome[],
    "total_income": number,
}

const apiDetails = Object.freeze(apiList.report.incomeByCategory);

export default function incomeByCategoryCashFlowReducer(state = initialState, action: DefaultAction): DefaultState<IncomeExpenseResponse> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getIncomeByCategoryAction = ( water_scheme_slug, this_year?: boolean): AppThunk<APIResponseDetail<IncomeExpenseResponse>> => async (dispatch: Dispatch) => {
    const variables = { disableSuccessToast: true, pathVariables: { water_scheme_slug } }
    if (this_year) variables['params'] = { this_year }
    return await initDefaultAction(apiDetails, dispatch, variables);
};