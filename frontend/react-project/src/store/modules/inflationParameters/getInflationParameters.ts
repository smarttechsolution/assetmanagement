import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type ExpenditureType = {
    dis_allow_edit: boolean
    id: number
    rate: number
}[]

const apiDetails = Object.freeze(apiList.inflationParamters.getInflationParameters);

export default function getInflationParametersReducer(state = initialState, action: DefaultAction): DefaultState<ExpenditureType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getInflationParametersAction = (lang,): AppThunk<APIResponseDetail<ExpenditureType>> => async (dispatch: Dispatch) => {
    const variables = { disableSuccessToast: true, pathVariables: { lang } }
    return await initDefaultAction(apiDetails, dispatch, variables);
};