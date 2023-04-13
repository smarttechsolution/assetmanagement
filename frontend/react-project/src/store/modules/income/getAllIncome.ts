import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

export interface AllIncomeType {
    id: number;
    category: Category;
    date: string;
    title: string;
    income_amount: number;
    water_supplied: number;
    date_np: string;
}

interface Category {
    id: number;
    name: string;
    e_name: string;
}


const apiDetails = Object.freeze(apiList.icome.getAllIncome);

export default function geAllIncomeReducer(state = initialState, action: DefaultAction): DefaultState<AllIncomeType[]> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const geAllIncomeAction = (lang, water_scheme_slug, date_from?: string, date_to?: string): AppThunk<APIResponseDetail<AllIncomeType[]>> => async (dispatch: Dispatch) => {

    const variables = { disableSuccessToast: true, pathVariables: { lang, water_scheme_slug } }

    if (date_from && date_to) variables['params'] = { date_from, date_to }

    return await initDefaultAction(apiDetails, dispatch, variables);
};