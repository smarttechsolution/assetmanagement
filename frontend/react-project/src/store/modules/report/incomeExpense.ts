import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

type incomeExpenseType = {
    year_from: string
    year_num: number
    year_to: string
    date__year: number,
    date__month: number,
    total_amount: string | number
}

type CFType = {
    date_from: string
    date_to: string
    date__month: string
    date__year: string
    cf: number
}


export type IncomeExpenseResponse = {
    "income": incomeExpenseType[],
    "expense": incomeExpenseType[],
    "cf": CFType[],
    "net_income": string | number,
    "net_expense": string | number,
    "net_balance": string | number,
    "total_population": string | number,
    "house_hold": string | number,
    "public_taps": string | number,
    "public_connection": string | number,
    "commercial_connection": string | number,
    "instutions": string | number,
    "daily_avg_supply": string | number
}

const apiDetails = Object.freeze(apiList.report.incomeExpense);

export default function incomeExpenseReducer(state = initialState, action: DefaultAction): DefaultState<IncomeExpenseResponse> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getIncomeExpenseAction = (lang, water_scheme_slug, this_year?: boolean): AppThunk<APIResponseDetail<IncomeExpenseResponse>> => async (dispatch: Dispatch) => {

    const variables = { disableSuccessToast: true, pathVariables: { lang, water_scheme_slug } }
    if (this_year) variables['params'] = { this_year }

    return await initDefaultAction(apiDetails, dispatch, variables);
};