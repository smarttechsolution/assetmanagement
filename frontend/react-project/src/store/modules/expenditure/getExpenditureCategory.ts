import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../actionNames";
import initDefaultAction, {
  APIResponseDetail,
} from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

export type ExpenditureCategoryType = {
  id: number;
  name: string;
}[];

const apiDetails = Object.freeze(apiList.expenditure.getExpenditureCategory);

export default function getExpenditureCategoryReducer(
  state = initialState,
  action: DefaultAction
): DefaultState<ExpenditureCategoryType> {
  const stateCopy = Object.assign({}, state);
  const actionName = apiDetails.actionName;

  return initDefaultReducer(actionName, action, stateCopy);
}

export const getExpenditureCategoryAction =
  (water_scheme_slug): AppThunk<APIResponseDetail<ExpenditureCategoryType>> =>
  async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, {
      disableSuccessToast: true,
      pathVariables: { water_scheme_slug },
    });
  };
