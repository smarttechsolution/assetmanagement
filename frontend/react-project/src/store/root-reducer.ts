import { AnyAction, combineReducers } from "redux";

import i18nextReducer from "./modules/i18n/i18n";
import loginReducer from "./modules/login/login";
import TokenService from "../services/jwt-token/jwt-token";
import outhReducer from "./modules/oauthservice";
import userDetails from "./modules/userDetails";
import schemeName from "./modules/schemeName";

import reportData from "./modules/report";
import waterTarrifsData from "./modules/waterTarrifs";
import incomeData from "./modules/income";
import expenditureData from "./modules/expenditure";
import waterSupplyData from "./modules/waterSupplySchedule";
import supplyBeltsData from "./modules/supplyBelts";
import testParamtersData from "./modules/testParamters";
import waterSchemeData from "./modules/waterScheme";
import maintainanceData from "./modules/maintainance";
import otherExpensesData from "./modules/otherExpenses";
import inflationParametersData from "./modules/inflationParameters";
import componentCategories from "./modules/componentCategories";
import component from "./modules/component";
import componentInfo from "./modules/componentInfo";
import notifications from "./modules/notifications";
import componentLogs from "./modules/componentLogs";
import waterSupplyRecord from "./modules/waterSupplyRecord";
import waterSupplyTest from "./modules/waterSupplyTest";

export const appReducer = combineReducers({
    i18nextData: i18nextReducer,
    loginData: loginReducer,
    outhService: outhReducer,
    schemeName,
    userDetails,
    waterSchemeData,
    reportData,
    waterTarrifsData,
    incomeData,
    expenditureData,
    waterSupplyData,
    supplyBeltsData,
    testParamtersData,
    maintainanceData,
    otherExpensesData,
    inflationParametersData,
    componentCategories,
    component,
    componentInfo,
    notifications,
    componentLogs,
    waterSupplyRecord,
    waterSupplyTest
});

export type RootState = ReturnType<typeof appReducer>;
type TState = ReturnType<typeof appReducer> | undefined;

export default function rootReducer(state: TState, action: AnyAction) {
    if (action.type === "USER_LOG_OUT") {
        state = undefined;
        try {
        } catch (err) {
            console.error("Logout Error", err);
        }
    }

    return appReducer(state, action);
};

export const logoutAction = () => {
    try {
        TokenService.clearToken();
    } catch (err) {
        console.error("LogOut Error", err);
    }

    return { type: "USER_LOG_OUT", payload: {} };
};
