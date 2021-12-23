import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getSupplyBeltsAction } from "store/modules/supplyBelts/getWaterSupplyBelts";
import { getSchemeUserAction } from "store/modules/waterScheme/getWaterSchemeUser";
import { postWaterSchemeUserAction } from "store/modules/waterScheme/postWaterSchemeUser";
import { updateWaterSchemeUserAction } from "store/modules/waterScheme/updateWaterSchemeUser";
import { RootState } from "store/root-reducer";
import { mobileUserInitialValues, mobileUserValidationSchema } from "./schema";

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
}

const Form = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const [initialData, setInitialData] = React.useState(mobileUserInitialValues);

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
      });
    }
  }, [props.editData]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: mobileUserValidationSchema,
    onSubmit: async (submitValue, { resetForm }) => {
      const requestData = submitValue;

      let res;
      if (props.editData) {
        res = await props.updateWaterSchemeUserAction(props.editData.id, requestData);
      } else {
        res = await props.postWaterSchemeUserAction(requestData);
      }

      console.log(res, "resss");

      if (res.status === 201 || res.status === 200) {
        if (res.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          setInitialData(mobileUserInitialValues);
          toast.success(t("home:updateSuccess"));
        }

        props.getSchemeUserAction();
      } else {
        const errors = Object.values(res.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row">
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:name")}:
            </label>

            <input
              className="form-control"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="name" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:phone")}:
            </label>

            <input
              className="form-control"
              name="phone_number"
              value={values.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="phone_number" errors={errors} touched={touched} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:username")}:
            </label>

            <input
              className="form-control"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={props.editData ? true : false}
            />
            <FormikValidationError name="username" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:password")} ({t("home:pin")}):
            </label>

            <input
              className="form-control"
              name="password1"
              type="number"
              value={values.password1}
              onChange={handleChange}
            />
            <FormikValidationError name="password1" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:confirmpassword")}:
            </label>

            <input
              className="form-control"
              name="password2"
              type="number"
              value={values.password2}
              onChange={handleChange}
            />
            <FormikValidationError name="password2" errors={errors} touched={touched} />
          </div>
        </div>

        <div className="col-md-12 text-right">
          <Button
            className="btn custom-btn  mr-3"
            text={t("home:save")}
            disabled={props.postLoading || props.updateLoading}
            loading={props.postLoading || props.updateLoading}
          />
          <Button
            className="btn custom-btn-outlined mr-3"
            text={t("home:cancel")}
            type="button"
            onClick={() => {
              props.toggle();
            }}
          />
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  supplySchedule: state.waterSupplyData.waterScheduleData.data,
  supplyBelts: state.supplyBeltsData.getSupplyBeltData.data,
  postLoading: state.waterSchemeData.postWaterSchemeUser.isFetching,
  updateLoading: state.waterSchemeData.updateWaterSchemeUser.isFetching,
});

const mapDispatchToProps = {
  getSupplyBeltsAction,
  postWaterSchemeUserAction,
  getSchemeUserAction,
  updateWaterSchemeUserAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Form);
