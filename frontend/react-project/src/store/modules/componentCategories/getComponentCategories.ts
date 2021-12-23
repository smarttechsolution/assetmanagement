import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type ComponentCategoriesType = {
    id: number,
    name: number,

}[]

const apiDetails = Object.freeze(apiList.componentCategories.getComponentCategories);

export default function getComponentCategoriesReducer(state = initialState, action: DefaultAction): DefaultState<ComponentCategoriesType> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const getComponentCategoriesAction = (): AppThunk<APIResponseDetail<ComponentCategoriesType>> => async (dispatch: Dispatch) => {
    const updatedDetails = { ...apiDetails }

    return await initDefaultAction(apiDetails, dispatch, updatedDetails);
};