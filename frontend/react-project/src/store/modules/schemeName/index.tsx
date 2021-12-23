import { Dispatch } from "redux";

const initialState = {
  schemeName: "",
};

type SchemeType = typeof initialState;

export default (state: SchemeType = initialState, action: DefaultAction): SchemeType => {
  const { type, payload } = action;
  switch (type) {
    case "UPDATE_SCHEME":
      return { ...state, schemeName: payload };

    default:
      return state;
  }
};

export const updateSchemeNameAction = (payload: string) => (dispatch) => {
  dispatch({
    type: "UPDATE_SCHEME",
    payload,
  });
};
