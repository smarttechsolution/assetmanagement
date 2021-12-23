import { Dispatch } from "redux";
import { AppThunk } from "../..";
import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";
import { SingleIncome } from "./incomeByCategory";



export type IncomeExpenseResponse = {
    "expense_all_time": SingleIncome[],
    "expense_this_year": SingleIncome[],
    "total_expense": number,
}

const apiDetails = Object.freeze(apiList.report.expenseByCategory);

export default function expenseByCategoryCashFlowReducer(state = initialState, action: DefaultAction): DefaultState<IncomeExpenseResponse> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getExpenseByCategoryAction = ( water_scheme_slug): AppThunk<APIResponseDetail<IncomeExpenseResponse>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { water_scheme_slug } });
};