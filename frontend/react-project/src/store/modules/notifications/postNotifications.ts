import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, {
    APIResponseDetail,
} from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type Notifications = any

const apiDetails = Object.freeze(
    apiList.notifications.postNotification
);

export default function postNotificationsReducer(
    state = initialState,
    action: DefaultAction
): DefaultState<Notifications> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const postNotificationsAction = (requestData): AppThunk<APIResponseDetail<Notifications>> =>
    async (dispatch: Dispatch) => {
        return await initDefaultAction(apiDetails, dispatch, {
            disableSuccessToast: true,
            requestData,
        });
    };
