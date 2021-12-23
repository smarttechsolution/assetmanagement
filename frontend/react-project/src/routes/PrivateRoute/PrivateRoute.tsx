import React, { Suspense } from "react";
import { Route, Switch, RouteComponentProps, useLocation, Redirect } from "react-router-dom";

import ErrorBoundary from "../../components/React/ErrorBoundary/ErrorBoundary";
import FallbackLoader from "../../components/React/FallbackLoader/FallbackLoader";

interface RenderRouteProps extends RouteComponentProps, CustomRoute {}

const RenderRoute: React.FC<CustomRoute> = props => {
    const { component } = props;
    const Component: React.ComponentType<RenderRouteProps> = component!
    
    return (
        <Route
            exact
            render={(routerProps: RouteComponentProps) => <ErrorBoundary><Component {...routerProps} {...props} /></ErrorBoundary>}
        />
    );
};

const PrivateRoute = (props: PrivateRouteProps & {redirectPath?: RouteRedirectProps, animate?: boolean}) => {
    const location = useLocation();
    const { appRoutes, redirectPath } = props;
    
    return (
        <Suspense fallback={<FallbackLoader />}>
            <Switch location={location}>
                {appRoutes.map((route, index) => (
                    <RenderRoute key={index} {...route} />
                ))}
                {redirectPath?.length && redirectPath.map((path, index) => (
                    path && <Redirect exact to={path.to} from={path.from} key={index} />
                ))}
            </Switch>
        </Suspense>
    )
};

export default PrivateRoute;