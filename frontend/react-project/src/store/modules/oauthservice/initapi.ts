import { Dispatch } from "redux";

import { AppThunk } from "../..";
import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

type InitApiResponse = {
  /**user detail response */
  profileApproved: boolean
  profileSetup: boolean
  role: string
  userId: number
  username: string
}

const initialInitApiState = initialState;
const apiDetails = Object.freeze(apiList.oauth.init);

export default function initUserReducer(state = initialInitApiState, action: DefaultAction): DefaultState<InitApiResponse> {
  const stateCopy = Object.assign({}, state);
  const actionName = apiDetails.actionName;

  return initDefaultReducer(actionName, action, stateCopy);
}

export const initUser = (): AppThunk<APIResponseDetail<InitApiResponse>> => async (dispatch: Dispatch) => {
  return await initDefaultAction(apiDetails, dispatch, { requestData: null, disableSuccessToast: true });
};