export enum RequestMethod {
  GET = "GET",
  DELETE = "DELETE",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  PURGE = "PURGE",
  LINK = "LINK",
  UNLINK = "UNLINK",
}

export enum RequestBodyType {
  /**If request id in application/x-www-form-urlencoded as string*/
  QUERYSTRING = "QUERY-STRING",
  /**If request is in formdata*/
  FORMDATA = "FORM-DATA",
  /**If request requires Bearer*/
  AUTH = "AUTH",
  /**If request is open*/
  NOAUTH = "NO-AUTH",
}

/**
 * API detail with redux action associated with it
 */
export interface apiDetailType {
  /**Redux Action Name */
  actionName: string;
  /**Request API URI */
  controllerName: string;
  /**Request Method; Defaults as GET */
  requestMethod?: RequestMethod;
  /**Request Body Type */
  requestBodyType?: RequestBodyType;
}

const apiDetails = {
  local: {
    i18n: {
      controllerName: "",
      actionName: "I18N"
    },
  },
  oauth: {
    login: {
      controllerName: "/api/v1/web-login/",
      actionName: "LOGIN",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.NOAUTH
    },
    init: {
      controllerName: "/oauth/user/init/data",
      actionName: "INIT",
      requestMethod: RequestMethod.GET
    }
  },

  report: {
    incomeExpense: {
      controllerName: "api/v1/report/income-expense/{lang}/{water_scheme_slug}/",
      actionName: "INCOME_EXPENSE",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    maintainanceCost: {
      controllerName: "api/v1/report/maintenance-cost/{water_scheme_slug}/",
      actionName: "MAINTAINANCE_COST",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    maintainanceCostByYear: {
      controllerName: "api/v1/report/maintenance-cost-by-cost/{water_scheme_slug}/",
      actionName: "MAINTAINANCE_COST_BY_YEAR",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    actualCumulativeCashFlow: {
      controllerName: "api/v1/report/actual-cumulative-cash-flow/{water_scheme_slug}/",
      actionName: "ACTUAL_CUMULATIVE_CF",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    expenseCumulativeCashFlow: {
      controllerName: "api/v1/report/expected-income-expense-cumulative-cash/{water_scheme_slug}/",
      actionName: "EXPENSE_CUMULITIVE_CF",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    expenseByCategory: {
      controllerName: "api/v1/report/expense-by-category/{water_scheme_slug}/",
      actionName: "EXPENSE_BY_CATEGORY",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    incomeByCategory: {
      controllerName: "api/v1/report/income-by-category/{water_scheme_slug}/",
      actionName: "INCOME_BY_CATEGORY",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    waterSupply: {
      controllerName: "api/v1/report/water-supply/{water_scheme_slug}/",
      actionName: "WATER_SUPPLY_REPORT",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    waterTestResult: {
      controllerName: "api/v1/report/water-test-results/{water_scheme_slug}/",
      actionName: " WATER_TEST_RESULTS",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
  },
  waterTarrif: {
    getWaterTarrifs: {
      controllerName: "api/v1/water-tariff/list/{lang}/{water_scheme_slug}/",
      actionName: "GET_WATER_TARRIF",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    getUseBasedWaterTarrifs: {
      controllerName: "api/v1/water-tariff/list/{lang}/{water_scheme_slug}/",
      actionName: "GET_USE_BASED_WATER_TARRIF",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    postUseBasedTarrifsRate: {
      controllerName: "api/v1/water-tariff/en/create/?tariff_type=use",
      actionName: "POST_USE_BASED_TARIFF_RATE",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.NOAUTH
    },
    updateUseBasedTarrifsRate: {
      controllerName: "api/v1/water-tariff/{lang}/{id}/",
      actionName: "UPDATE_USE_BASED_TARIFF_RATE",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.NOAUTH
    },
    deleteUseBasedTarrifsRate: {
      controllerName: "api/v1/water-tariff/use-based-data/delete/{id}/",
      actionName: "DELETE_USE_BASED_DATA",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.NOAUTH
    },
    deleteTarrifsRate: {
      controllerName: "api/v1/water-tariff/{id}/delete/",
      actionName: "UPDATE_USE_BASED_TARIFF_RATE",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.NOAUTH
    },
    postFixedRateBasedTarrifsRate: {
      controllerName: "api/v1/water-tariff/{lang}/create/?tariff_type=fixed",
      actionName: "POST_FIXED_RATE_TARIFF_RATE",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.NOAUTH
    },
    updateFixedRateBasedTarrifsRate: {
      controllerName: "api/v1/water-tariff/{lang}/{id}/?tariff_type=fixed",
      actionName: "UPDATE_FIXED_RATE_TARIFF_RATE",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.NOAUTH
    },
    incomeEstimateThisYear: {
      controllerName: "api/v1/tariff/get-list/{scheme}/",
      actionName: "USE_BASES_INCOME_ESTIMATES",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
  },

  maintainance: {
    dashboardComponentInfo: {
      controllerName: "api/v1/maintenance/dashboard-componant-info/{lang}/{water_scheme_slug}/",
      actionName: "DASHBOARD_COMPONENT_INFO",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    }
  },


  register: {
    controllerName: "/external/public/user/registration",
    actionName: "REGISTER",
    requestMethod: RequestMethod.POST,
    requestBodyType: RequestBodyType.NOAUTH
  },
  supplyBelts: {
    getsupplyBelts: {
      controllerName: "api/v1/supply-belts/list/{lang}/{water_scheme_slug}/",
      actionName: "GET_WATER_SUPPLY_BELTS",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH
    },
    postsupplyBelts: {
      controllerName: "api/v1/supply-belts/{lang}/create/",
      actionName: "POST_SUPPLY_BELTS",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH
    },
    updatesupplyBelts: {
      controllerName: "api/v1/supply-belts/{lang}/{id}/",
      actionName: "UPDATE_SUPPLY_BELTS",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH
    },
    deletesupplyBelts: {
      controllerName: "api/v1/supply-belts/{lang}/{id}/delete/",
      actionName: "DELETE_SUPPLY_BELTS",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH
    },
  },
  testParameters: {
    getTestParameters: {
      controllerName: "api/v1/test-parameter/",
      actionName: "GET_TEST_PARAMETERS",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    postTestParameters: {
      controllerName: "api/v1/test-parameter/",
      actionName: "POST_TEST_PARAMETERS",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH
    },
    updateTestParameters: {
      controllerName: "api/v1/test-parameter/{id}/",
      actionName: "UPDATE_TEST_PARAMETERS",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH
    },
    deleteTestParameters: {
      controllerName: "api/v1/test-parameter/{id}/",
      actionName: "DELETE_TEST_PARAMETERS",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH
    },
    deleteMultipleTestParameters: {
      controllerName: "api/v1/test-parameter/bulk-delete/",
      actionName: "DELETE_MULTIPLE_TEST_PARAMETERS",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH
    },
  },
  waterScheme: {
    getSchemeDetails: {
      controllerName: "api/v1/water-scheme/detail/{slug}/",
      actionName: "GET_SCHEME_DETAILS",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    updateSchemeDetails: {
      controllerName: "api/v1/water-scheme/update/{lang}/{slug}/",
      actionName: "UPDATE_SCHEME_DETAILS",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH
    },
    getYearIntervals: {
      controllerName: "api/v1/year-intervals/{lang}/{water_scheme_slug}/",
      actionName: "GET_YEAR_INTERVALS",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    getWaterSchemeData: {
      controllerName: "api/v1/water-scheme-data/list/{lang}/",
      actionName: "GET_WATER_SCHEME_DATA",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    postWaterSchemeData: {
      controllerName: "api/v1/water-scheme-data/{lang}/create/",
      actionName: "POST_WATER_SCHEME_DATA",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH
    },
    updateWaterSchemeData: {
      controllerName: "api/v1/water-scheme-data/{lang}/{id}/",
      actionName: "UPDATE_WATER_SCHEME_DATA",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH
    },
    deleteWaterSchemeData: {
      controllerName: "api/v1/water-scheme-data/{lang}/{id}/delete/",
      actionName: "UPDATE_WATER_SCHEME_DATA",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH
    },
    getWaterSchemeUser: {
      controllerName: "api/v1/user/care-taker/list/",
      actionName: "GET_WATER_SCHEME_CARETAKER",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    deleteWaterSchemeUser: {
      controllerName: "api/v1/water-scheme/care-taker/delete/{id}/",
      actionName: "DELETE_WATER_SCHEME_CARETAKER",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.NOAUTH
    },
    postWaterSchemeUser: {
      controllerName: "api/v1/water-scheme/care-taker/create/",
      actionName: "POST_WATER_SCHEME_CARETAKER",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH
    },
    updateWaterSchemeUser: {
      controllerName: "api/v1/water-scheme/care-taker/update/{id}/",
      actionName: "UPDATE_WATER_SCHEME_CARETAKER",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH
    },
    // deleteWaterSchemeCaretaker: {
    //   controllerName: "api/v1/test-parameter/{id}/",
    //   actionName: "DELETE_WATER_SCHEME_CARETAKER",
    //   requestMethod: RequestMethod.DELETE,
    //   requestBodyType: RequestBodyType.AUTH
    // },
  },

  waterSupplySchedule: {
    getWaterSupplySchedule: {
      controllerName: "api/v1/water-supply-schedule/list/{lang}/{water_scheme_slug}/",
      actionName: "GET_WATER_SUPPLY_SCHEDULE",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    postWaterSupplySchedule: {
      controllerName: "api/v1/water-supply-schedule/{lang}/create/",
      actionName: "POST_WATER_SUPPLY_SCHEDULE",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH
    },
    updateWaterSupplySchedule: {
      controllerName: "api/v1/water-supply-schedule/{lang}/{id}/",
      actionName: "UPDATE_WATER_SUPPLY_SCHEDULE",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH
    },
    deleteWaterSupplySchedule: {
      controllerName: "api/v1/water-supply-schedule/{lang}/{id}/delete/",
      actionName: "POST_WATER_SUPPLY_SCHEDULE",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH
    },
  },

  icome: {
    getIcome: {
      controllerName: "api/v1/income/{lang}/list/{water_scheme_slug}/",
      actionName: "GET_INCOME",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    postIncome: {
      controllerName: "api/v1/income/{lang}/create/",
      actionName: "POST_INCOME",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    updateIncome: {
      controllerName: "api/v1/income/{lang}/update/{id}/",
      actionName: "UPDATE_INCOME",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    deleteIncome: {
      controllerName: "api/v1/income/delete/{id}/",
      actionName: "DELETE_INCOME",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    getPreviousIncomeTotal: {
      controllerName:
        "api/v1/present-previous-month/income-total/{lang}/{water_scheme_slug}/",
      actionName: "GET_PREVIOUS_INCOME_TOTAL",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    getIncomeTotal: {
      controllerName: "api/v1/income-total/{lang}/{water_scheme_slug}/date-range/",
      actionName: "GET_INCOME_TOTAL",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    getIncomeExpenseImage: {
      controllerName: "api/v1/income-expense/image-by-month/{lang}/{water_scheme_slug}/",
      actionName: "GET_INCOME_EXPENSE_IMAGE",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    getIncomeCategory: {
      controllerName: "api/v1/income-category/list/{water_scheme_slug}/",
      actionName: "GET_INCOME_CATEGORY",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    postIncomeCategories: {
      controllerName: "api/v1/income-category/create/",
      actionName: "POST_INCOME_CATEGORIES",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH,
    },
    updateIncomeCategories: {
      controllerName: "api/v1/income-category/update/{id}/",
      actionName: "UPDATE_INCOME_CATEGORIES",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH,
    },
    deleteIncomeCategories: {
      controllerName: "api/v1/income-category/delete/{id}/",
      actionName: "DELETE_INCOME_CATEGORIES",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH,
    },
    getAllIncome: {
      controllerName: "api/v1/income/{lang}/list-all/{water_scheme_slug}/",
      actionName: "GETT_ALL_INCOME",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  expenditure: {
    getExpenditure: {
      controllerName: "api/v1/expenditure/{lang}/list/{water_scheme_slug}/",
      actionName: "GET_EXPENDITURE",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    postExpenditure: {
      controllerName: "api/v1/expenditure/{lang}/create/",
      actionName: "POST_INCOME",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    updateExpenditure: {
      controllerName: "api/v1/expenditure/{lang}/update/{id}/",
      actionName: "UPDATE_INCOME",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    deleteExpenditure: {
      controllerName: "api/v1/expenditure/delete/{id}/",
      actionName: "DELETE_INCOME",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    getPreviousExpenditureTotal: {
      controllerName:
        "api/v1/present-previous-month/expenditure-total/{lang}/{water_scheme_slug}/",
      actionName: "GET_PREVIOUS_EXPENDITURE_TOTAL",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    getExpenditureTotal: {
      controllerName: "api/v1/expenditure-total/{lang}/{water_scheme_slug}/date-range/",
      actionName: "GET_EXPENDITURE_TOTAL",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH
    },
    getExpenditureCategory: {
      controllerName: "api/v1/expense-category/list/{water_scheme_slug}/",
      actionName: "GET_EXPENDITURE_CATEGORY",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.NOAUTH,
    },
    postExpenseCategories: {
      controllerName: "api/v1/expense-category/create/",
      actionName: "POST_EXPENSE_CATEGORIES",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH,
    },
    updateExpenseCategories: {
      controllerName: "api/v1/expense-category/update/{id}/",
      actionName: "UPDATE_EXPENSE_CATEGORIES",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH,
    },
    deleteExpenseCategories: {
      controllerName: "api/v1/expense-category/delete/{id}/",
      actionName: "DELETE_EXPENSE_CATEGORIES",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH,
    },
    getAllExpenditure: {
      controllerName: "api/v1/expenditure/{lang}/list-all/{water_scheme_slug}/",
      actionName: "GETT_ALL_EXPENDITURE",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  otherExpenses: {
    getOtherExpenses: {
      controllerName:
        "api/v1/other-expenses/list/{lang}/",
      actionName: "GET_OTHER_EXPENSES",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    postOtherExpenses: {
      controllerName:
        "api/v1/other-expenses/{lang}/create/",
      actionName: "POST_OTHER_EXPENSES",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH,
    },
    updateOtherExpenses: {
      controllerName:
        "api/v1/other-expenses/{lang}/{id}/",
      actionName: "UPDATE_OTHER_EXPENSES",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH,
    },
    deleteOtherExpenses: {
      controllerName:
        "api/v1/other-expenses/{lang}/{id}/delete/",
      actionName: "DELETE_OTHER_EXPENSES",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  inflationParamters: {
    getInflationParameters: {
      controllerName:
        "api/v1/inflation-parameter/list/{lang}/",
      actionName: "GET_INFLATION_PARAMETERS",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    postInflationParameters: {
      controllerName:
        "api/v1/inflation-parameter/{lang}/create/",
      actionName: "POST_INFLATION_PARAMETERS",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH,
    },
    updateInflationParameters: {
      controllerName:
        "api/v1/inflation-parameter/{lang}/{id}/",
      actionName: "UPDATE_INFLATION_PARAMETERS",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH,
    },
    deleteInflationParameters: {
      controllerName:
        "api/v1/inflation-parameter/{lang}/{id}/delete/",
      actionName: "DELETE_INFLATION_PARAMETERS",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  componentCategories: {
    getComponentCategories: {
      controllerName:
        "api/v1/maintenance/component-category/list/",
      actionName: "GET_COMPONENT_CATEGORIES",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    postComponentCategories: {
      controllerName:
        "api/v1/maintenance/component-category/create/",
      actionName: "POST_COMPONENT_CATEGORIES",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH,
    },
    updateComponentCategories: {
      controllerName:
        "api/v1/maintenance/component-category/update/{id}/",
      actionName: "UPDATE_COMPONENT_CATEGORIES",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH,
    },
    deleteComponentCategories: {
      controllerName:
        "api/v1/maintenance/component-category/delete/{id}/",
      actionName: "DELETE_COMPONENT_CATEGORIES",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  component: {
    getComponent: {
      controllerName:
        "api/v1/maintenance/component/list/",
      actionName: "GET_COMPONENT",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    postComponent: {
      controllerName:
        "api/v1/maintenance/component/create/",
      actionName: "POST_COMPONENT",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH,
    },
    updateComponent: {
      controllerName:
        "api/v1/maintenance/component/update/{id}/",
      actionName: "UPDATE_COMPONENT",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH,
    },
    deleteComponent: {
      controllerName:
        "api/v1/maintenance/component/delete/{id}/",
      actionName: "DELETE_COMPONENT",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  componentInfo: {
    getComponentInfo: {
      controllerName:
        "api/v1/maintenance/component-info/{lang}/list/",
      actionName: "GET_COMPONENT_INFO",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    getComponentInfoById: {
      controllerName:
        "api/v1/maintenance/component-info/{lang}/{id}/",
      actionName: "GET_COMPONENT_INFO_BY_ID",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    postComponentInfo: {
      controllerName:
        "api/v1/maintenance/component-info/{lang}/create/",
      actionName: "POST_COMPONENT_INFO",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.FORMDATA,
    },
    updateComponentInfo: {
      controllerName:
        "api/v1/maintenance/component-info/{lang}/update/{id}/",
      actionName: "UPDATE_COMPONENT_INFO",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.FORMDATA,
    },
    deleteComponentInfo: {
      controllerName:
        "api/v1/maintenance/component-infos/delete/{id}/",
      actionName: "DELETE_COMPONENT_INFO",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  notifications: {
    getNotificationDetails: {
      controllerName:
        "api/v1/notification/period/{water_scheme_slug}/",
      actionName: "GET_NOTIFICATIONS",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    postNotification: {
      controllerName:
        "api/v1/notification/period-create/",
      actionName: "POST_NOTIFICATIONS",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH,
    },
    updateNotification: {
      controllerName:
        "api/v1/notification/period-update/{id}/",
      actionName: "UPDATE_NOTIFICATIONS",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  componentLogs: {
    getComponentLogs: {
      controllerName:
        "api/v1/config-component-log/list/{lang}/",
      actionName: "GET_COMPONENT_LOGS",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    getComponentLogById: {
      controllerName:
        "api/v1/config-component-log/update/{id}/{lang}/",
      actionName: "GET_COMPONENT_LOGS_BY_ID",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    postComponentLogs: {
      controllerName:
        "api/v1/config-component-log/create/{lang}/",
      actionName: "POST_COMPONENT_LOGS",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.FORMDATA,
    },
    updateComponentLogs: {
      controllerName:
        "api/v1/config-component-log/update/{id}/{lang}/",
      actionName: "UPDATE_COMPONENT_LOGS",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.FORMDATA,
    },
    deleteComponentLogs: {
      controllerName:
        "api/v1/config-component-log/delete/{id}/",
      actionName: "DELETE_COMPONENT_LOGS",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  waterSupplyRecord: {
    // subharaj
    postWaterSupplyRecordA: {
      controllerName:
        "api/v1/water-supply-record/{lang}/create/",
      actionName: "POST_WATER_SUPPLY_RECORD",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.FORMDATA,
    },

    getWaterSupplyRecord: {
      controllerName:
        "api/v1/config/water-supply-record/list/{lang}/",
      actionName: "GET_WATER_SUPPLY_RECORD",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    getWaterSupplyRecordsById: {
      controllerName:
        "api/v1/config/water-supply-record/update/{id}/{lang}/",
      actionName: "GET_WATER_SUPPLY_RECORD_BY_ID",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    postWaterSupplyRecord: {
      controllerName:
        "api/v1/config/water-supply-record/{lang}/create/",
      actionName: "POST_WATER_SUPPLY_RECORD",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.FORMDATA,
    },
    updateWaterSupplyRecord: {
      controllerName:
        "api/v1/config/water-supply-record/{lang}/{id}/",
      actionName: "UPDATE_WATER_SUPPLY_RECORD",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.FORMDATA,
    },
    deleteWaterSupplyRecord: {
      controllerName:
        "api/v1/config/water-supply-record/{id}/delete/",
      actionName: "DELETE_WATER_SUPPLY_RECORD",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  waterSupplyTest: {
    getWaterSupplyTest: {
      controllerName:
        "api/v1/config/water-test-results/list/{lang}/",
      actionName: "GET_WATER_SUPPLY_TEST",
      requestMethod: RequestMethod.GET,
      requestBodyType: RequestBodyType.AUTH,
    },
    postWaterSupplyTest: {
      controllerName:
        "api/v1/config/water-test-results/{lang}/create/",
      actionName: "POST_WATER_SUPPLY_TEST",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH,
    },
    postWaterTestResult: {
      controllerName:
        "api/v1/water-test-results/{lang}/create/",
      actionName: "POST_WATER_TEST_RESULTS",
      requestMethod: RequestMethod.POST,
      requestBodyType: RequestBodyType.AUTH,
    },
    updateWaterSupplyTest: {
      controllerName:
        "api/v1/config/water-test-results/{lang}/{id}/",
      actionName: "UPDATE_WATER_SUPPLY_TEST",
      requestMethod: RequestMethod.PUT,
      requestBodyType: RequestBodyType.AUTH,
    },
    deleteWaterSupplyTest: {
      controllerName:
        "api/v1/config/water-test-results/{id}/delete/",
      actionName: "DELETE_WATER_SUPPLY_TEST",
      requestMethod: RequestMethod.DELETE,
      requestBodyType: RequestBodyType.AUTH,
    },
  },
  

};

type ApiList = typeof apiDetails;
export const apiList: ApiList = apiDetails;
