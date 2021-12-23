import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, {
    APIResponseDetail,
} from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type IncomeCategories = {
    image: string;
    error: string;
};

const apiDetails = Object.freeze(
    apiList.icome.deleteIncomeCategories
);

export default function deleteIncomeCategoriesReducer(
    state = initialState,
    action: DefaultAction
): DefaultState<IncomeCategories> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const deleteIncomeCategoriesAction = (id): AppThunk<APIResponseDetail<IncomeCategories>> =>
    async (dispatch: Dispatch) => {
        return await initDefaultAction(apiDetails, dispatch, {
            disableSuccessToast: true,
            pathVariables: { id }
        });
    };
