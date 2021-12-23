import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type DeleteParametersType = {

}

type requestData = any

const apiDetails = Object.freeze(apiList.waterScheme.deleteWaterSchemeData);

export default function deleteWaterSchemeDataReducer(state = initialState, action: DefaultAction): DefaultState<DeleteParametersType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const deleteWaterSchemeDataAction = (lang, id: requestData): AppThunk<APIResponseDetail<DeleteParametersType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang, id } });
};