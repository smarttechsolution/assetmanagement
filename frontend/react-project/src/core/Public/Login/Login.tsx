import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React, { ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps, shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { switchI18nLanguage } from "store/modules/i18n/i18n";
import { loginUser } from "store/modules/login/login";
import { addUserDetails } from "store/modules/userDetails";
import { RootState } from "store/root-reducer";
import { object as YupObject, string as YupString } from "yup";

interface Props extends PropsFromRedux {}
export interface UserCredentials {
  username: string;
  password: string;
}

function Login(props: Props): ReactElement {
  const { loginData, loginUser, switchI18nLanguage } = props;

  const history = useHistory();
  const i18nextData = useSelector((state: RootState) => state.i18nextData, shallowEqual);

  const handleLogin = useCallback(
    async (userDetails: UserCredentials) => {
      const loginres: any = await loginUser(userDetails);
 
      if (loginres?.data?.tokens?.access) {
        props.addUserDetails(loginres.data);
        history.push("/auth/home");
      } else {
        toast.error(loginres?.data?.detail);
        // toast.error(loginres)
      }
    },
    [loginUser, history]
  );

  return (
    <div className="app bg-white">
      <div className="container">
        <div className="auth-wrapper">
          <LoginForm handleLogin={handleLogin} authorizing={loginData.isFetching} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  loginData: state.loginData,
});

const mapDispatchToProps = {
  loginUser: loginUser,
  switchI18nLanguage: switchI18nLanguage,
  addUserDetails: addUserDetails,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Login);

interface LoginFormProps {
  handleLogin: (credentials: UserCredentials) => void;
  /**Status indicating if login is initiating */
  authorizing: boolean;
}
const LoginForm = ({ authorizing, handleLogin }: LoginFormProps) => {
  const { t } = useTranslation(["login", "register"]);

  const [passwordView, showPassword] = useState(false);
  const togglePassword = () => showPassword(!passwordView);
  const [initialValue] = useState({ username: "", password: "" });

  const loginValidationSchema = YupObject().shape({
    username: YupString().required("login:input.username.error-required"),
    password: YupString().required("login:input.password.error-required"),
  });

  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: initialValue,
    validationSchema: loginValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      handleLogin(values);
    },
  });

  return (
    <div className="auth-body">
      <form className="" onSubmit={handleSubmit} autoComplete="off">
        {/* <h5 className="mb-2 font-bold">Water</h5> */}
        <p className="">Water Asset Management System</p>

        <h6 className="mb-2 font-bold">CONFIGURATIONS</h6>

        <div className="auth-form">
          <div className="form-group align-vertical">
            <label htmlFor="" className="mr-4 label">
              {t("login:input.username.title")}
            </label>
            <input
              className="form-control"
              name="username"
              value={values.username}
              onChange={handleChange}
              required
            />
            <FormikValidationError name="username" errors={errors} touched={touched} />
          </div>

          <div className="form-group align-vertical mt-4">
            <label htmlFor="" className="mr-4 label">
              {t("login:input.password.title")}
            </label>

            <input
              className="form-control"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              required
            />

            <span
              className={`${passwordView ? "ic-view" : "ic-hidden"} text-coolGray600`}
              role="button"
              onClick={togglePassword}
            ></span>
            <FormikValidationError name="password" errors={errors} touched={touched} />
          </div>

          <div className="auth-footer">
            {/* <div className="flex-grow-1 des">
                    <span className="text-coolGray600">{t("login:dontHaveAnAccount.title")} </span>
                    <Link to="/register" className="text-blue">{t("register:title")}</Link>
                </div> */}
            <Button
              className="btn btn-outlined-primary"
              text={t("login:title")}
              disabled={authorizing}
              loading={authorizing}
            />
          </div>
        </div>
      </form>
      <div className="contact_info">
        <div className="contact">
          <h6>Contact Us:</h6>
          <a href="mailto:info@smarttech.com.np">info@smarttech.com.np</a>
        </div>
      </div>
    </div>
  );
};
