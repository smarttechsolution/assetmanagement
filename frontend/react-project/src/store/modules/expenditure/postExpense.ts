import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, {
    APIResponseDetail,
} from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type Expense = {
    image: string;
};

const apiDetails = Object.freeze(
    apiList.expenditure.postExpenditure
);

export default function postExpenseReducer(
    state = initialState,
    action: DefaultAction
): DefaultState<Expense> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const postExpenseAction = (lang, requestData): AppThunk<APIResponseDetail<Expense>> =>
    async (dispatch: Dispatch) => {
        return await initDefaultAction(apiDetails, dispatch, {
            disableSuccessToast: true,
            requestData,
            pathVariables: { lang }
        });
    };
