import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, {
    APIResponseDetail,
} from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type InflationParameters = {
    image: string;
};

const apiDetails = Object.freeze(
    apiList.inflationParamters.updateInflationParameters
);

export default function updateInflationparametersReducer(
    state = initialState,
    action: DefaultAction
): DefaultState<InflationParameters> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const updateInflationparametersAction = (lang, id, requestData): AppThunk<APIResponseDetail<InflationParameters>> =>
    async (dispatch: Dispatch) => {
        return await initDefaultAction(apiDetails, dispatch, {
            disableSuccessToast: true,
            requestData,
            pathVariables: { lang, id }
        });
    };
