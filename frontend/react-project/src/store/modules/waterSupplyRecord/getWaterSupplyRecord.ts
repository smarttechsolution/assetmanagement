import { Dispatch } from "redux";
import { AppThunk } from "../..";
import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";



export type WaterSupplyRecordType = {
    id: number;
    supply_date: string;
    supply_end_date: string;
    total_supply: number;

}[]

const apiDetails = Object.freeze(apiList.waterSupplyRecord.getWaterSupplyRecord);

export default function getWaterSupplyRecordReducer(state = initialState, action: DefaultAction): DefaultState<WaterSupplyRecordType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getWaterSupplyRecordAction = (lang, date_from?: any, date_to?: any): AppThunk<APIResponseDetail<WaterSupplyRecordType>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true, pathVariables: { lang }, params: { date_from, date_to } });
};
// ?date_from=2022-03-27&date_to=2022-04-12
