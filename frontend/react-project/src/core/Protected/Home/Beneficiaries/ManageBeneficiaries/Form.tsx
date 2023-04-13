import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import TooltipLabel from "components/UI/TooltipLabel";
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
  setEditData: any
}

const Form = (props: Props) => {
  const { t } = useTranslation(["home"]);
  const [initialData, setInitialData] = React.useState(supplyBeltInitialValues);

  React.useEffect(() => {
    if (props.language && props.schemeSlug) {
      props.getSchemeDataAction(props.language);
    }
  }, [props.language, props.schemeSlug]);

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
      });
    } else {
      setInitialData({
        ...initialData,
        apply_date: props.scheme?.tool_start_date,
      });
    }
  }, [props.editData, props.scheme]);

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialData,
      validationSchema: supplyBeltValidationSchema,
      onSubmit: async (submitValue, { resetForm }) => {
        let requestData = {};

        for (const key in submitValue) {
          if (submitValue[key]) {
            requestData[key] = submitValue[key];
          } else {
            requestData[key] = "0";
          }
        }

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
            resetForm()
            toast.success(t("home:postSuccess"));
          } else {
            setInitialData(supplyBeltInitialValues);
            props.setEditData(null)
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

  console.log(errors, values, touched, "errrrpro");

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
              {t("home:houseConn")}{" "}
              {/* <TooltipLabel id={"tnohuws"} text={`Total number of houses using water system`} />: */}
            </label>

            <input
              type="number"
              className="form-control"
              name="household_connection"
              value={values.household_connection}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="household_connection" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 ">
              {t("home:instConn")}{" "}
              {/* <TooltipLabel
                id={"tnoieocu"}
                text={`Total number of Institutional/ educational organization using water system`}
              /> */}
              :
            </label>

            <input
              type="number"
              className="form-control"
              name="institutional_connection"
              value={values.institutional_connection}
              onChange={handleChange}
              onBlur={handleBlur}
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
              {t("home:publicConn")}:
            </label>

            <input
              type="number"
              className="form-control"
              name="public_connection"
              value={values.public_connection}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="public_connection" errors={errors} touched={touched} />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 ">
              {t("home:commercialConn")}{" "}
              {/* <TooltipLabel
                id={"tnocuws"}
                text={`Total number of commercials using water system`}
              /> */}
              :
            </label>

            <input
              type="number"
              className="form-control"
              name="commercial_connection"
              value={values.commercial_connection}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="commercial_connection" errors={errors} touched={touched} />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 ">
              {t("home:applyDate")}{" "}
              <TooltipLabel
                id={"tnohuws"}
                text={t("home:appdate")}
              />
              :
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

        <div className="col-md-12 text-right">
          <Button
            type="submit"
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
