/// <reference types="react-scripts" />

/**
 * REDUX DEVTOOLS EXTENSION INSTALLED IN BROWSER
 */
interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
}

/**
 * React Select Option Type
 */
interface OptionType { label: string; value: any }


/**
 * Default Redux Action
 */
type DefaultAction<TPayload = any> = {
    type: string;
    payload?: TPayload
}
interface DefaultState<TData = any> {
    data: TData;
    message: string;
    isFetching: boolean;
    isFailed: boolean;
    isSuccess: boolean;
}
interface DefaultDispatchType {
    progressDispatch: string;
    successDispatch: string;
    failureDispatch: string;
}

/**
 * Custom Route Detail
 */
type CustomRoute = {
    path: string;
    component: React.ComponentType<any>
    children?: route[];
    type?: string;
}
interface PrivateRouteProps {
    appRoutes: route[]
}
interface PrivateRouteChildren {
    children: route[]
}
/**
 * Custom PrivateRoute redirect props
 */
type RouteRedirectProps = ({ from: string; to: string; } | null)[]

/**
 * 
 */
type TTranslationFunction = (key: string) => string

/**
 * Primitive types
 */
type Primitive = string | boolean | number;

