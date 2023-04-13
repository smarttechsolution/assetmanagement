import { Dispatch } from "redux";
import { AppThunk } from "../..";
import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";



export type WaterTestResultType = {
    id: number;
    date: string;
    test_result_parameter: TestResultParameter[];
}[]


interface TestResultParameter {
    parameter: number;
    value: number;
    name: string;
    unit: string;
}

const apiDetails = Object.freeze(apiList.waterSupplyTest.getWaterSupplyTest);

export default function getWaterSupplyTestReducer(state = initialState, action: DefaultAction): DefaultState<WaterTestResultType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getWaterSupplyTestAction = (lang, date_from?:any, date_to?:any): AppThunk<APIResponseDetail<WaterTestResultType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang }, params: { date_from, date_to } });
};
