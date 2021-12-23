import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, {
  APIResponseDetail,
} from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

type expenseType = {
  income_category_name: string;
  expense_category_name: string;
  total_expense_amount: number;
  total_income_amount: number;
};
export type PreviousExpenditureTotal = {
  previous_month_data: expenseType[];
  present_month_data: expenseType[];
};

const apiDetails = Object.freeze(
  apiList.icome.getPreviousIncomeTotal
);

export default function getPreviousIncomeTotalReducer(
  state = initialState,
  action: DefaultAction
): DefaultState<PreviousExpenditureTotal> {
  const stateCopy = Object.assign({}, state);
  const actionName = apiDetails.actionName;

  return initDefaultReducer(actionName, action, stateCopy);
}

export const getPreviousIncomeTotalAction =
  (
    lang,
    water_scheme_slug,
    year,
    month
  ): AppThunk<APIResponseDetail<PreviousExpenditureTotal>> =>
    async (dispatch: Dispatch) => {
      return await initDefaultAction(apiDetails, dispatch, {
        disableSuccessToast: true,
        pathVariables: { lang, water_scheme_slug },
        params: { year, month },
      });
    };
