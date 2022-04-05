import { lazy } from 'react';

const Login = lazy(() => import("core/Public/Login/Login"));
const Dashboard = lazy(() => import("core/Public/Dashboard/Dashboard"));
const Home = lazy(() => import("core/Public/Home"));
const CashBook = lazy(() => import("core/Public/Finance/CashBook"));
const Visualization = lazy(() => import("core/Public/Finance/Visualization"));
const CostVisualization = lazy(() => import("core/Public/Maintainance/CostVisualization"));
const AssetComponent = lazy(() => import("core/Public/Maintainance/AssetComponent"));
const SupplyVisualization = lazy(() => import("core/Public/Service/SupplyVisualization"));
const WaterTestResults = lazy(() => import("core/Public/Service/WaterTestResults"));
const NotFound = lazy(() => import("core/Public/404"))

const InternalHome = lazy(() => import("core/Protected/Home"));
const InternalTarrifRates = lazy(() => import("core/Protected/Finance/TarrifRates"));
const InternalOtherExpense = lazy(() => import("core/Protected/Finance/OtherExpense"));
const InflationParamters = lazy(() => import("core/Protected/Finance/InflationParamters"));
const InternalCashBook = lazy(() => import("core/Protected/Finance/CashBook"));
const InternalQualityTestParameters = lazy(() => import("core/Protected/Service/QualityTestParameters"));
const InternalAssetComponents = lazy(() => import("core/Protected/Maintainance/AssetComponent"));
const InternalComponentLogs = lazy(() => import("core/Protected/Maintainance/ComponentLogs"));
const InternalManageCategories = lazy(() => import("core/Protected/Maintainance/ManageCategories"));
const InternalUpdateNotifications = lazy(() => import("core/Protected/Notifications/UpdateNotifications"));
const ManageWaterTestResult = lazy(() => import("core/Protected/Service/WaterTestResult"));
const WaterSupplyRecord = lazy(() => import("core/Protected/Service/WaterSupplyRecord"));
const WaterQualityTest = lazy(() => import("core/Protected/Service/ParametersTest"));


const appRoutes: CustomRoute[] = [
    {
        path: "/login",
        component: Login,
        type: "login"
    },

    {
        path: "/",
        component: Dashboard,
        type: "unauthorized",
        children: [
            {
                path: "/scheme/:scheme/home",
                component: Home,
            },
            {
                path: "/scheme/:scheme/cash-book",
                component: CashBook,
            },
            {
                path: "/scheme/:scheme/visualization",
                component: Visualization,
            },
            {
                path: "/scheme/:scheme/cost-visualization",
                component: CostVisualization,
            },
            {
                path: "/scheme/:scheme/asset-components",
                component: AssetComponent,
            },
            {
                path: "/scheme/:scheme/supply-visualization",
                component: SupplyVisualization,
            },
            {
                path: "/scheme/:scheme/quality-test-results",
                component: WaterTestResults,
            },

            {
                path: "/auth/home",
                component: InternalHome,
                type: "authorized",
            },
            {
                path: "/auth/tarrif-rates",
                component: InternalTarrifRates,
                type: "authorized",
            },
            {
                path: "/auth/other-expense",
                component: InternalOtherExpense,
                type: "authorized",
            },
            {
                path: "/auth/inflation-parameters",
                component: InflationParamters,
                type: "authorized",
            },
            {
                path: "/auth/cash-book",
                component: InternalCashBook,
                type: "authorized",
            },
            {
                path: "/auth/manage-categories",
                component: InternalManageCategories,
                type: "authorized",
            },
            {
                path: "/auth/asset-components",
                component: InternalAssetComponents,
                type: "authorized",
            },
            {
                path: "/auth/component-logs",
                component: InternalComponentLogs,
                type: "authorized",
            },
            {
                path: "/auth/quality-test-parameters",
                component: InternalQualityTestParameters,
                type: "authorized",
            },
            {
                path: "/auth/update-notification",
                component: InternalUpdateNotifications,
                type: "authorized",
            },
            {
                path: "/auth/water-quality-test",
                component: WaterQualityTest,
                type: "authorized",
            },
            {
                path: "/auth/water-supply-record",
                component: WaterSupplyRecord,
                type: "authorized",
            },
            // {
            //     path: "/auth/water-test-result",
            //     component: ManageWaterTestResult,
            //     type: "authorized",
            // },


            {
                path: "/",
                component: NotFound,
            },
        ],
    },

]

export default appRoutes