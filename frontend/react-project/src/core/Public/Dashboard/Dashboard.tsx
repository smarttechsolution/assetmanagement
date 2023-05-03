import React, { ReactElement, useState } from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import PrivateRoute from "routes/PrivateRoute/PrivateRoute";
import useAuthentication from "services/authentication/AuthenticationService";
import TokenService from "services/jwt-token/jwt-token";
import { updateSchemeNameAction } from "store/modules/schemeName";
import { getSchemeYearIntervalsAction } from "store/modules/waterScheme/getYearIntervals";
import { getWaterSchemeDetailsAction } from "store/modules/waterScheme/waterSchemeDetails";
import { RootState } from "store/root-reducer";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
// import Footer from "./Footer/Footer";

interface Props extends PropsFromRedux {
  children: any;
}

function Dashboard(props: Props): ReactElement {
  const { children } = props;
  const history = useHistory();
  const [sidebarToggle, setsidebarToggle] = useState(false);

  const { isAuthenticated } = useAuthentication();

  const getSchemeDetails = async () => {
    const containsSchemeInUrl = window.location.hash.split("/")[1] === "scheme";

    if (containsSchemeInUrl) {
      const route = window.location.hash.split("/")[2];
      const response = await props.getWaterSchemeDetailsAction(route);
      
      if (response.data && response.status !== 400) {
        props.updateSchemeNameAction(route);
        props.getSchemeYearIntervalsAction(props.langauge, route);
      } else {
        history.replace("/");
      }
    } else if (isAuthenticated()) {
      const tokenData = TokenService.getAccessToken();
      const response = await props.getWaterSchemeDetailsAction(tokenData?.slug);

      if (response.data && response.status !== 400) {
        props.updateSchemeNameAction(tokenData?.slug);
        props.getSchemeYearIntervalsAction(props.langauge, tokenData?.slug);
      }
    } else if (window.location.href?.includes("auth")) {
      history.replace("/login");
    } else {
      history.replace("/");
    }
  };

  React.useEffect(() => {
    if (window.location.hash && props.langauge) {
      getSchemeDetails();
    }
  }, [props.langauge, window.location.hash]);

  return (
    <div
      className={`app theme-dark-blue ${sidebarToggle ? "toggled" : ""}`}
      style={{ position: "relative" }}
    >
      <Sidebar sidebarToggle={sidebarToggle} setsidebarToggle={setsidebarToggle} />
      <main className="stickyHeader">
        <Header sidebarToggle={sidebarToggle} setsidebarToggle={setsidebarToggle} />
        <div className="inner">
          <PrivateRoute
            appRoutes={children}
            redirectPath={[{ to: isAuthenticated() ? "/auth/home" : "/home", from: "*" }]}
          />
        </div>
      </main>
      {/* <main className="relativeFooter">
        <Footer />
      </main> */}
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  langauge: state.i18nextData.languageType,
});

const mapDispatchToProps = {
  getWaterSchemeDetailsAction: getWaterSchemeDetailsAction,
  updateSchemeNameAction: updateSchemeNameAction,
  getSchemeYearIntervalsAction: getSchemeYearIntervalsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Dashboard);
