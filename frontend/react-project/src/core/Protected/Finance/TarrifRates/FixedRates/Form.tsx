import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getWaterTarrifsAction } from "store/modules/waterTarrifs/getWaterTarrifs";
import { postFixedRateWaterTariffAction } from "store/modules/waterTarrifs/postFixedRateWaterTariff";
import { updateFixedRateWaterTariffAction } from "store/modules/waterTarrifs/updateFixedBasedWaterTariff";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { getUsIncomeEstimateThisYearAction } from "store/modules/waterTarrifs/getIncomeEstimateThisYear";
import TooltipLabel from "components/UI/TooltipLabel";

interface Props extends PropsFromRedux {
  editData;
  setEditData: any;
}

const validationSchema = Yup.object({
  rate_for_institution: Yup.string().required("This field is required"),
  rate_for_household: Yup.string().required("This field is required"),
  rate_for_public: Yup.string().required("This field is required"),
  rate_for_commercial: Yup.string().required("This field is required"),
  apply_date: Yup.string().required("This field is required"),
  estimated_paying_connection_household: Yup.string().required("This field is required"),
  estimated_paying_connection_institution: Yup.string().required("This field is required"),
  estimated_paying_connection_public: Yup.string().required("This field is required"),
  estimated_paying_connection_commercial: Yup.string().required("This field is required"),
});

const UseBasedForm = (props: Props) => {
  const { t } = useTranslation();
  const [initialData, setInitialData] = React.useState({
    terif_type: "Fixed",
    rate_for_institution: "",
    rate_for_household: "",
    rate_for_public: "",
    rate_for_commercial: "",
    apply_date: "",
    estimated_paying_connection_household: "",
    estimated_paying_connection_institution: "",
    estimated_paying_connection_public: "",
    estimated_paying_connection_commercial: "",
  });

  React.useEffect(() => {
    if (props.scheme) {
      setInitialData({
        terif_type: "Fixed",
        rate_for_institution: "",
        rate_for_household: "",
        rate_for_public: "",
        rate_for_commercial: "",
        apply_date: "",
        estimated_paying_connection_household: "",
        estimated_paying_connection_institution: "",
        estimated_paying_connection_public: "",
        estimated_paying_connection_commercial: "",
      });
    }
  }, [props.scheme]);

  const { values, errors, touched, handleChange, handleBlur, handleReset, setFieldValue, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialData,
      validationSchema: validationSchema,
      onSubmit: async (values, { resetForm }) => {
        let response;

        if (props.editData) {
          response = await props.updateFixedRateWaterTariffAction(
            props.language,
            props.editData.id,
            values,
            { tariff_type: "fixed" }
          );
        } else {
          response = await props.postFixedRateWaterTariffAction(props.language, values, { tariff_type: "fixed" });
        }

        if (response.status === 201 || response.status === 200) {
          props.getUsIncomeEstimateThisYearAction(props.schemeSlug);

          if (response.status === 201) {
            resetForm();
            toast.success(t("home:postSuccess"));
          } else {
            setInitialData({
              terif_type: "Fixed",
              rate_for_institution: "",
              rate_for_household: "",
              rate_for_public: "",
              rate_for_commercial: "",
              apply_date: "",
              estimated_paying_connection_household: "",
              estimated_paying_connection_institution: "",
              estimated_paying_connection_public: "",
              estimated_paying_connection_commercial: "",
            });
            props.setEditData(null);
            // props.getOtherExpensesAction(props.language);
            toast.success(t("home:updateSuccess"));
          }
          props.getWaterTarrifsAction(props.language, props.schemeSlug, "fixed");

        } else {
          const errorList = response.data && response.data.error;
          if (errorList instanceof Array) {
            errorList.forEach((item) => {
              toast.error(item);
            });
          }
          console.log(response, "errrr");
        }
      },
    });

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
      });
    }
  }, [props.editData]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="row align-items-end">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group mt-2">
                <label htmlFor="" className="mr-1 label pl-0">
                  {t("finance:applyDate")}
                  <TooltipLabel
                    id={"apd"}
                    text={t("home:appdate")}
                  />
                </label>

                {props.scheme?.system_date_format === "nep" ? (
                  <>
                    <NepaliDatePicker
                      value={values.apply_date}
                      name="apply_date"
                      onChange={(e) => {
                        setFieldValue("apply_date", e);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <EnglishDatePicker
                      name="apply_date"
                      value={values.apply_date}
                      handleChange={(e) => {
                        setFieldValue("apply_date", formatDate(e));
                      }}
                    />
                  </>
                )}
                <FormikValidationError name="apply_date" errors={errors} touched={touched} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 label pl-0">
              {t("finance:roh")}
            </label>

            <input
              type="number"
              className="form-control"
              name="rate_for_household"
              value={values.rate_for_household}
              onChange={handleChange}
            />
            <FormikValidationError name="rate_for_household" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 label pl-0">
              {t("finance:roi")}
            </label>

            <input
              type="number"
              className="form-control"
              name="rate_for_institution"
              value={values.rate_for_institution}
              onChange={handleChange}
            />
            <FormikValidationError name="rate_for_institution" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 label pl-0">
              {t("finance:rop")}
            </label>

            <input
              type="number"
              className="form-control"
              name="rate_for_public"
              value={values.rate_for_public}
              onChange={handleChange}
            />
            <FormikValidationError name="rate_for_public" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 label pl-0">
              {t("finance:roc")}
            </label>

            <input
              type="number"
              className="form-control"
              name="rate_for_commercial"
              value={values.rate_for_commercial}
              onChange={handleChange}
            />
            <FormikValidationError name="rate_for_commercial" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="" className="mr-1 label pl-0">
              {t("finance:epch")}
              <TooltipLabel id={"roh"} text={t("home:EPChouse")} />
            </label>

            <input
              type="number"
              className="form-control"
              name="estimated_paying_connection_household"
              value={values.estimated_paying_connection_household}
              onChange={handleChange}
            />
            <FormikValidationError
              name="estimated_paying_connection_household"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="" className="mr-1 label pl-0">
              {t("finance:epci")}
              <TooltipLabel id={"epci"} text={t("home:EPCinstitute")} />
            </label>

            <input
              type="number"
              className="form-control"
              name="estimated_paying_connection_institution"
              value={values.estimated_paying_connection_institution}
              onChange={handleChange}
            />
            <FormikValidationError
              name="estimated_paying_connection_institution"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="" className="mr-1 label pl-0">
              {t("finance:epcp")}
              <TooltipLabel id={"epcp"} text={t("home:EPCpublic")} />
            </label>

            <input
              type="number"
              className="form-control"
              name="estimated_paying_connection_public"
              value={values.estimated_paying_connection_public}
              onChange={handleChange}
            />
            <FormikValidationError
              name="estimated_paying_connection_public"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="" className="mr-1 label pl-0">
              {t("finance:epcc")}
              <TooltipLabel id={"epcc"} text={t("home:EPCcommercial")} />
            </label>

            <input
              type="number"
              className="form-control"
              name="estimated_paying_connection_commercial"
              value={values.estimated_paying_connection_commercial}
              onChange={handleChange}
            />
            <FormikValidationError
              name="estimated_paying_connection_commercial"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-md-12 mt-2 text-right">
          <Button
            className="btn custom-btn mr-2"
            text={t("home:save")}
            type="submit"
            disabled={props.postLoading || props.updateLoading}
            loading={props.postLoading || props.updateLoading}
          />
          <Button
            className="btn custom-btn-outlined"
            text={t("home:cancel")}
            type='reset'
            onClick={() => {
              const resetKeys: any = Object.keys(initialData).reduce((acc, curr) => {
                if(['terif_type'].indexOf(curr) === -1) {
                  acc[curr] = "";
                } else {
                  acc[curr] = initialData[curr];
                  console.log(acc[curr], initialData[curr], curr, 'yahi ho');
                  
                }
                return acc;
              }, {});

              setInitialData(resetKeys)
              props.setEditData(null);
              handleReset({
                initialData
              })
            }}
          />
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  postLoading: state.waterTarrifsData.postFixedRateWaterTariff.isFetching,
  updateLoading: state.waterTarrifsData.updateUseBasedWaterTariff.isFetching,
});

const mapDispatchToProps = {
  postFixedRateWaterTariffAction: postFixedRateWaterTariffAction,
  getWaterTarrifsAction: getWaterTarrifsAction,
  updateFixedRateWaterTariffAction: updateFixedRateWaterTariffAction,
  getUsIncomeEstimateThisYearAction: getUsIncomeEstimateThisYearAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UseBasedForm);
