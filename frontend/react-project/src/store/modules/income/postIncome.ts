import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, {
    APIResponseDetail,
} from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type Income = {
    image: string;
};

const apiDetails = Object.freeze(
    apiList.icome.postIncome
);

export default function postIncomeReducer(
    state = initialState,
    action: DefaultAction
): DefaultState<Income> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;
    return initDefaultReducer(actionName, action, stateCopy);
}

export const postIncomeAction = (lang, requestData): AppThunk<APIResponseDetail<Income>> =>
    async (dispatch: Dispatch) => {
        return await initDefaultAction(apiDetails, dispatch, {
            disableSuccessToast: true,
            requestData,
            pathVariables: { lang }
        });
    };
