import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getSchemeDataAction } from "store/modules/waterScheme/getWaterSchemeData";
import { postWaterSchemeDataAction } from "store/modules/waterScheme/postWaterSchemeData";
import { updateWaterSchemeDataAction } from "store/modules/waterScheme/updateWaterSchemeData";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
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
      props.getSchemeDataAction(props.language);
    }
  }, [props.language, props.schemeSlug]);

  React.useEffect(() => {
    if (props.editData) {
      seetInitialData({
        ...props.editData,
      });
    }
  }, [props.editData]);

  React.useEffect(() => {
    if (props.scheme) {
      seetInitialData({
        ...props.editData,
        apply_date: props.scheme?.tool_start_date,
      });
    }
  }, [props.scheme]);

  const { values, errors, touched, handleChange, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: supplyBeltValidationSchema,
    onSubmit: async (submitValue, { resetForm }) => {
      const requestData = {
        ...submitValue,
      };

      let res;
      if (props.editData) {
        res = await props.updateWaterSchemeDataAction(
          props.language,
          props.editData.id,
          requestData
        );
      } else {
        res = await props.postWaterSchemeDataAction(props.language, requestData);
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

        props.getSchemeDataAction(props.language);
      } else {
        const errors = Object.values(res.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }
    },
  });

  console.log(initialData, "initialDatainitialData");

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
            <label htmlFor="" className="mr-1 ">
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
            <label htmlFor="" className="mr-1 ">
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
            <label htmlFor="" className="mr-1 ">
              {t("home:applyDate")}:
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
            <FormikValidationError name="belt_type" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 ">
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
            <label htmlFor="" className="mr-1 ">
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

        <div className="col-md-12 text-right">
          <Button
            className="btn custom-btn  mr-3"
            text={t("home:save")}
            loading={props.postLoading || props.updateLoading}
            disabled={props.postLoading || props.updateLoading}
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
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  supplySchedule: state.waterSupplyData.waterScheduleData.data,
  supplyBelts: state.supplyBeltsData.getSupplyBeltData.data,
  postLoading: state.waterSchemeData.postWaterSchemeData.isFetching,
  updateLoading: state.waterSchemeData.updateWaterSchemeData.isFetching,
});

const mapDispatchToProps = {
  getSchemeDataAction,
  postWaterSchemeDataAction,
  updateWaterSchemeDataAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Form);
