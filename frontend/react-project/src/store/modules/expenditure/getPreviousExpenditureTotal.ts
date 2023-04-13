import { Dispatch } from "redux";
import { string } from "yup";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, {
  APIResponseDetail,
} from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

type expenseType = {
  expense_category_name: string;
  total_expense_amount: number;
};
export type PreviousExpenditureTotal = {
  previous_month_data: expenseType[];
  present_month_data: expenseType[];
};

const apiDetails = Object.freeze(
  apiList.expenditure.getPreviousExpenditureTotal
);

export default function getPreviousExpenditureTotalReducer(
  state = initialState,
  action: DefaultAction
): DefaultState<PreviousExpenditureTotal> {
  const stateCopy = Object.assign({}, state);
  const actionName = apiDetails.actionName;

  return initDefaultReducer(actionName, action, stateCopy);
}

export const getPreviousExpenditureTotalAction =(lang, water_scheme_slug,year, month): AppThunk<APIResponseDetail<PreviousExpenditureTotal>> =>
  async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, {
      disableSuccessToast: true,
      pathVariables: { lang, water_scheme_slug },
      params: { year, month},
    });
  };
