import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type NotificationDetails = {
    "id": number,
    "initial_date": string,
    "income_notification_period": number,
    "expenditure_notification_period": number,
    "test_result_notification_period": number,
    "supply_record_notification_period": number
}[]

const apiDetails = Object.freeze(apiList.notifications.getNotificationDetails);

export default function getNotificationDetailsReducer(state = initialState, action: DefaultAction): DefaultState<NotificationDetails> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getNotificationDetailsAction = (water_scheme_slug,): AppThunk<APIResponseDetail<NotificationDetails>> => async (dispatch: Dispatch) => {
    const variables = { disableSuccessToast: true, pathVariables: { water_scheme_slug } }
    return await initDefaultAction(apiDetails, dispatch, variables);
};