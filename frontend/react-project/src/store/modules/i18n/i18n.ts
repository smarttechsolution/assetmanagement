import { Dispatch } from "redux";
import { AppThunk } from "../..";
import { apiList } from "../../actionNames";
import initDispatchTypes from "../../helper/default-action-type";

enum i18nLanguage {
    EN = "en",
    NE = "nep"
}
export interface i18nextReduxState {
    /** Current selected language 'en' or 'nep' */
    languageType: i18nLanguage;
}

const i18nextActions = {
    LANG_CHANGE_INIT: 'I18N_INIT',
    LANG_CHANGE_SUCCESS: 'I18N_SUCCESS',
    LANG_CHANGE_FAIL: 'I18N_FAIL'
}

const i18nextObject: i18nextReduxState = {
    languageType: i18nLanguage.EN
};

const seti18nLanguage = (language: string) => {
    return localStorage.setItem(btoa(btoa("i18n")), btoa(btoa(language)))
}

export const geti18nLanguage = () => {
    try {
        return atob(atob(localStorage.getItem((btoa(btoa("i18n")))) || ""));
    } catch (e) {
        console.error("Error getting language", e);
        return ""
    }
}

export const switchI18nLanguage = (payload: string): AppThunk => async (dispatch: Dispatch) => {
    const apiDetails = apiList.local.i18n;

    // Init dispatch type
    const dispatchTypes = initDispatchTypes(apiDetails.actionName);

    try {
        // Store in redux
        seti18nLanguage(payload);
        dispatch({ type: dispatchTypes.successDispatch, payload: payload });
    } catch (e) {
        console.error("Error switching language", e);
        dispatch({ type: dispatchTypes.failureDispatch, payload: payload });
        return
    }
}

export default function i18nextReducer(store: i18nextReduxState = { ...i18nextObject }, action: DefaultAction): i18nextReduxState {
    const state = Object.assign({}, store);

    switch (action.type) {
        case i18nextActions.LANG_CHANGE_SUCCESS: {
            return {
                ...state,
                languageType: action.payload,
            };
        }
        default: {
            return state;
        }
    }
}