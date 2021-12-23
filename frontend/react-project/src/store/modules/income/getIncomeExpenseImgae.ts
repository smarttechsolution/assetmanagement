import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, {
    APIResponseDetail,
} from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

type imageType = {
    image: string;
};
export type PreviousExpenditureTotal = imageType[]

const apiDetails = Object.freeze(
    apiList.icome.getIncomeExpenseImage
);

export default function getIncomeExpenseImageReducer(
    state = initialState,
    action: DefaultAction
): DefaultState<PreviousExpenditureTotal> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getIncomeExpenseImageAction = (lang, water_scheme_slug, date): AppThunk<APIResponseDetail<PreviousExpenditureTotal>> =>
    async (dispatch: Dispatch) => {
        return await initDefaultAction(apiDetails, dispatch, {
            disableSuccessToast: true,
            pathVariables: { lang, water_scheme_slug },
            params: { date },
        });
    };
