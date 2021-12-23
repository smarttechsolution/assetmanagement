import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type ComponentType = {
    id: number,
    name: string,
    category: {
        id: string
        name: string
    }

}[]

const apiDetails = Object.freeze(apiList.component.getComponent);

export default function getComponentReducer(state = initialState, action: DefaultAction): DefaultState<ComponentType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getComponentAction = (): AppThunk<APIResponseDetail<ComponentType>> => async (dispatch: Dispatch) => {
    const updatedDetails = { ...apiDetails }

    return await initDefaultAction(apiDetails, dispatch, updatedDetails);
};