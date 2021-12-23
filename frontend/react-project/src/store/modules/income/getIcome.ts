import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type IncomeType = {
    category: { id: number, name: string }
    date: string
    date_np: string
    id: number
    income_amount: number
    title: string
    water_supplied: number
}[]

const apiDetails = Object.freeze(apiList.icome.getIcome);

export default function getIncomeReducer(state = initialState, action: DefaultAction): DefaultState<IncomeType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getIncomeAction = (lang, water_scheme_slug, year?: string, month?: string): AppThunk<APIResponseDetail<IncomeType>> => async (dispatch: Dispatch) => {

    const variables = { disableSuccessToast: true, pathVariables: { lang, water_scheme_slug } }

    if (year && month) variables['params'] = { year, month } 

    return await initDefaultAction(apiDetails, dispatch, variables);
};