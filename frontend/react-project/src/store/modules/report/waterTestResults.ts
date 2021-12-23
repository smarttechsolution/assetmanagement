import { Dispatch } from "redux";
import { AppThunk } from "../..";
import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

type TestResult = {
    date_from: number
    date_to: number
    data_count: number
    parameter__parameter_name: string
    test_result__date__year: number
    test_result__date__month: number
    total_value: number  
}[]


type WaterTestResult = {
    data: TestResult
}[]

const apiDetails = Object.freeze(apiList.report.waterTestResult);

export default function WaterTestResultsReducer(state = initialState, action: DefaultAction): DefaultState<WaterTestResult> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getWaterTestResultsAction = ( water_scheme_slug, this_year?: boolean): AppThunk<APIResponseDetail<WaterTestResult>> => async (dispatch: Dispatch) => {
    const variables = { disableSuccessToast: true, pathVariables: {  water_scheme_slug } }
    if (this_year) variables['params'] = { this_year }
    return await initDefaultAction(apiDetails, dispatch, variables);
};