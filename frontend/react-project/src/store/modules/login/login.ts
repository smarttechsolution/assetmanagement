import { Dispatch } from "redux";

import { AppThunk } from "../..";
import { apiList } from "../../actionNames";
import { UserCredentials } from "../../../core/Public/Login/Login";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDispatchTypes from "../../helper/default-action-type";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";
import TokenService from "../../../services/jwt-token/jwt-token";

type LoginResponse = { 
    data: {
        "tokens": {
            access: string
            refresh: string
        },
        "detail": string,
        "error": string,
    }
}

const initialLoginState = initialState;
const apiDetails = Object.freeze(apiList.oauth.login);

export default function loginReducer(state = initialLoginState, action: DefaultAction): DefaultState<LoginResponse> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const loginUser = (requestData: UserCredentials): AppThunk<APIResponseDetail<LoginResponse>> => async (dispatch: Dispatch) => {
    const loginData = await initDefaultAction(apiDetails, dispatch, { requestData, disableSuccessToast: true });
 
    if (loginData && loginData.data && loginData?.data?.tokens?.access && typeof loginData?.data?.tokens?.access === "string") {
        const dispatchTypes = initDispatchTypes(apiDetails.actionName);
        // Override login dispatch to remove data except tokens.access
        dispatch({ type: dispatchTypes.successDispatch, payload: { status: 1, data: loginData.data.tokens.access } });
        TokenService.setToken(loginData.data);
    }

    return loginData;
};