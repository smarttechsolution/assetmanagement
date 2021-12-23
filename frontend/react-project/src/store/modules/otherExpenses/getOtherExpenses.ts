import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type OtherExpenseType = {
    id: string
    title: string
    yearly_expense: string
    category: string

}[]

const apiDetails = Object.freeze(apiList.otherExpenses.getOtherExpenses);

export default function getOtherExpensesReducer(state = initialState, action: DefaultAction): DefaultState<OtherExpenseType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getOtherExpensesAction = (lang: string): AppThunk<APIResponseDetail<OtherExpenseType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { ...apiDetails, disableToast: true, pathVariables: { lang } });
};