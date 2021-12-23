import { Dispatch } from "redux";
import { AppThunk } from "../..";
import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


type SingleExpenseCF = {
    cf: string
    month: number
    year: number
    date_from: string
    date_to: string
    expense: number
    expense_amount: number
    income_amount: number
    income: number
}


export type IncomeExpenseResponse = {
    "monthly_cf": SingleExpenseCF[],
    "expected_cf": SingleExpenseCF[],
    "expected_expense": SingleExpenseCF[],
    "monthly_expense": SingleExpenseCF[],
    "expected_income": SingleExpenseCF[],
    "monthly_income": SingleExpenseCF[],
}

const apiDetails = Object.freeze(apiList.report.expenseCumulativeCashFlow);

export default function expenseCumulativeCashFlowReducer(state = initialState, action: DefaultAction): DefaultState<IncomeExpenseResponse> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getExpenseCumulativeAction = (water_scheme_slug, this_year?: boolean): AppThunk<APIResponseDetail<IncomeExpenseResponse>> => async (dispatch: Dispatch) => {
    const variables = { disableSuccessToast: true, pathVariables: { water_scheme_slug } }
    if (this_year) variables['params'] = { this_year }
    return await initDefaultAction(apiDetails, dispatch, variables);
};