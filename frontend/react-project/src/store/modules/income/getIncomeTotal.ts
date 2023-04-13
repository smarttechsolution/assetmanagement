import { Dispatch } from "redux";
import { string } from "yup";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, {
  APIResponseDetail,
} from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

export interface expenseType {
  total_income: number;
};

const apiDetails = Object.freeze(
  apiList.icome.getIncomeTotal
);

export default function getIncomeTotalReducer(
  state = initialState,
  action: DefaultAction
): DefaultState<expenseType[]> {
  const stateCopy = Object.assign({}, state);
  const actionName = apiDetails.actionName;

  return initDefaultReducer(actionName, action, stateCopy);
}

export const getIncomeTotalAction =(lang, water_scheme_slug,date_from?: string, date_to?:string): AppThunk<APIResponseDetail<expenseType[]>> =>
  async (dispatch: Dispatch) => {
    const variables = { disableSuccessToast: true, pathVariables: { lang, water_scheme_slug } }

    if (date_from && date_to) variables['params'] = { date_from, date_to }

    return await initDefaultAction(apiDetails, dispatch, variables);
    
  };
