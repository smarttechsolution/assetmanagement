import toast from "components/React/ToastNotifier/ToastNotifier";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import appRoutes from "routes/routes";
import PrivateRoute from "routes/PrivateRoute/PrivateRoute";
import useAuthentication from "services/authentication/AuthenticationService";
import TokenService from "services/jwt-token/jwt-token";
import { geti18nLanguage, switchI18nLanguage } from "store/modules/i18n/i18n";
import { addUserDetails } from "store/modules/userDetails";
import { RootState } from "store/root-reducer";
import "./App.scss";
import { Helmet } from 'react-helmet';

// Initialize Notification Toaster
toast.configure({
  position: "top-right",
  autoClose: 5000,
  closeButton: false,
  draggable: false,
});

function App() {
  const {
    i18nextData: { languageType },
  } = useSelector((state: RootState) => ({ i18nextData: state.i18nextData }));
  const dispatch = useDispatch();

  const { isAuthenticated } = useAuthentication();

  useEffect(() => {
    // Initialize i18n during mount as dynamic import
    // Synchronizing i18 state with redux state
    import("./i18n/i18n").then((i18n) => {
      const persistedLanguage = geti18nLanguage();

      if (persistedLanguage && persistedLanguage !== languageType) {
        dispatch(switchI18nLanguage(persistedLanguage));
        i18n.default.changeLanguage(persistedLanguage);
      } else if (i18n.default.language !== languageType) {
        i18n.default.changeLanguage(languageType);
      }
    });
  }, [languageType, dispatch]);

  // Disable Console
  useEffect(() => {
    // Disable Console during production
    if (process.env.NODE_ENV === "production") {
      console.log = function () {};
      window.console.log =
        window.console.debug =
        window.console.info =
        window.console.error =
          function () {
            return false;
          };
    }
  }, []);

  //fetch token from localstorage and set details on reducer
  useEffect(() => {
    const userDetails = TokenService.getAccessToken();
    dispatch(addUserDetails(userDetails));
  }, []);

  const [ title, setTitle ] = React.useState<any>();

  useEffect(() => {
    var path = window.location.href;
    const arr = path.split('/')

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (element === 'auth') {
        var ele = (<Helmet>
          <title>AMS | Config</title>
        </Helmet>)
        setTitle(ele)
      }else if(element === 'scheme'){
        var ele = (<Helmet>
          <title>AMS | Dashboard</title>
        </Helmet>)
        setTitle(ele)
      }
    }

  }, [])

  return (
    <>
    {title}
      {isAuthenticated() ? (
        <PrivateRoute
          appRoutes={appRoutes.filter((route) => route.type !== "login")}
          redirectPath={[{ from: "*", to: "/auth/home" }]}
        />
      ) : (
        <PrivateRoute
          appRoutes={appRoutes.filter((route) => {
            return (
              route.children?.filter((item) => item.type !== "authorized") ||
              route.type === "login"
            );
          })}
          redirectPath={[{ from: "*", to: "/welcome" }]}
        />
      )}
    </>
  );
}

export default App;
