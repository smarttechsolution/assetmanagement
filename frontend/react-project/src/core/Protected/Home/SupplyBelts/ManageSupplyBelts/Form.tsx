import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getSupplyBeltsAction } from "store/modules/supplyBelts/getWaterSupplyBelts";
import { postSupplyBeltAction } from "store/modules/supplyBelts/postSupplyBelt";
import { updateSupplyBeltAction } from "store/modules/supplyBelts/updateSupplyBelt";
import { RootState } from "store/root-reducer";
import { supplyBeltInitialValues, supplyBeltValidationSchema } from "./schema";

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
}

const Form = (props: Props) => {
  const { t } = useTranslation(["home"]);
  const [initialData, seetInitialData] = React.useState(supplyBeltInitialValues);

  React.useEffect(() => {
    if (props.language && props.schemeSlug) {
      props.getSupplyBeltsAction(props.language, props.schemeSlug);
    }
  }, [props.language, props.schemeSlug]);

  React.useEffect(() => {
    if (props.editData) {
      seetInitialData({
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
    validationSchema: supplyBeltValidationSchema,
    onSubmit: async (submitValue, { resetForm }) => {
      const requestData = {
        ...submitValue,
      };

      let res;
      if (props.editData) {
        res = await props.updateSupplyBeltAction(props.language, props.editData.id, requestData);
      } else {
        res = await props.postSupplyBeltAction(props.language, requestData);
      }

      console.log(res, "resss");

      if (res.status === 201 || res.status === 200) {
        if (res.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          seetInitialData(supplyBeltInitialValues);
          toast.success(t("home:updateSuccess"));
        }

        props.getSupplyBeltsAction(props.language, props.schemeSlug);
      } else {
        const errors = Object.values(res.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }
    },
  });
  console.log(errors, "resss");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row">
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:beneficiary")} {t("home:households")}:
            </label>

            <input
              type="number"
              className="form-control"
              name="beneficiary_household"
              value={values.beneficiary_household}
              onChange={handleChange}
            />
            <FormikValidationError name="beneficiary_household" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:beneficiary")} {t("home:population")}:
            </label>

            <input
              type="number"
              className="form-control"
              name="beneficiary_population"
              value={values.beneficiary_population}
              onChange={handleChange}
            />
            <FormikValidationError
              name="beneficiary_population"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:instConn")}:
            </label>

            <input
              type="number"
              className="form-control"
              name="institutional_connection"
              value={values.institutional_connection}
              onChange={handleChange}
            />
            <FormikValidationError
              name="institutional_connection"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:publicTaps")}:
            </label>

            <input
              type="number"
              className="form-control"
              name="public_taps"
              value={values.public_taps}
              onChange={handleChange}
            />
            <FormikValidationError name="public_taps" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:name")}:
            </label>

            <input
              className="form-control"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
            <FormikValidationError name="name" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:beltType")}:
            </label>

            <input
              className="form-control"
              name="belt_type"
              value={values.belt_type}
              onChange={handleChange}
            />
            <FormikValidationError name="belt_type" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-12">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:coverageArea")}:
            </label>

            <textarea
              className="form-control"
              name="coverage_area"
              rows={2}
              value={values.coverage_area}
              onChange={handleChange}
              required
            />
            <FormikValidationError name="coverage_area" errors={errors} touched={touched} />
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
  postLoading: state.supplyBeltsData.postSupplyBelt.isFetching,
  updateLoading: state.supplyBeltsData.updateSupplyBelt.isFetching,
});

const mapDispatchToProps = {
  getSupplyBeltsAction,
  postSupplyBeltAction: postSupplyBeltAction,
  updateSupplyBeltAction: updateSupplyBeltAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Form);
