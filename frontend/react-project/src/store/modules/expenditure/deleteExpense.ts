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
    apiList.expenditure.deleteExpenditure
);

export default function deleteExpenditureReducer(
    state = initialState,
    action: DefaultAction
): DefaultState<Expense> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const deleteExpenditureAction = (id): AppThunk<APIResponseDetail<Expense>> =>
    async (dispatch: Dispatch) => {
        return await initDefaultAction(apiDetails, dispatch, {
            disableSuccessToast: true,
            pathVariables: { id }
        });
    };
