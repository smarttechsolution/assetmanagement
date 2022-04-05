import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";
interface RootObject {
    id: number;
    household_connection: number;
    public_connection: number;
    commercial_connection: number;
    institutional_connection: number;
    apply_date: string;
}

export type YearaIntervalType = {
    apply_date: string
    beneficiary_household: number
    beneficiary_population: number
    id: number
    institutional_connection: number
    public_taps: number
    household_connection: number;
    public_connection: number;
    commercial_connection: number;
}[]

const apiDetails = Object.freeze(apiList.waterScheme.getWaterSchemeData);

export default function getSchemeDataReducer(state = initialState, action: DefaultAction): DefaultState<YearaIntervalType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getSchemeDataAction = (lang): AppThunk<APIResponseDetail<YearaIntervalType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang } });
};