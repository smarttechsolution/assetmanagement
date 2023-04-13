import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type YearaIntervalType = {
    "id": number,
    "start_date": string,
    "is_present_year": boolean,
    "end_date": string,
    "year_num": number,
}[]

const apiDetails = Object.freeze(apiList.waterScheme.getYearIntervals);

export default function getSchemeYearIntervalsReducer(state = initialState, action: DefaultAction): DefaultState<YearaIntervalType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getSchemeYearIntervalsAction = (lang, water_scheme_slug): AppThunk<APIResponseDetail<YearaIntervalType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang: "en", water_scheme_slug } });
};