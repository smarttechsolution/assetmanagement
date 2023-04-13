import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import { default as StyledSelect } from "components/React/StyledSelect/CreatableSelect";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { GeneralCard } from "components/UI/GeneralCard";
import GeneralModal from "components/UI/GeneralModal";
import TooltipLabel from "components/UI/TooltipLabel";
import { SYSTEM_DATE_FORMAT_OPTIONS } from "constants/constants";
import { useFormik } from "formik";
import { getNumberByLanguage } from "i18n/i18n";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps, useDispatch, useSelector } from "react-redux";
import { updateWaterSchemeDetailsAction } from "store/modules/waterScheme/updateWaterSchemeDetails";
import { getWaterSchemeDetailsAction } from "store/modules/waterScheme/waterSchemeDetails";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
import { generalInfoInitialValues, generalInfoValidationSchema } from "./scheme";

interface Props extends PropsFromRedux { }

const GeneralInfo = (props: Props) => {
  const { t } = useTranslation("");


  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);

  const [initialData, setInitialData] =
    useState<typeof generalInfoInitialValues>(generalInfoInitialValues);

  const userDetails = useSelector((state: RootState) => state.userDetails);

  const waterSchemeDetails = useSelector(
    (state: RootState) => state.waterSchemeData.waterSchemeDetailsData.data
  );

  const {
    values,
    errors,
    touched,
    setFieldTouched,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: generalInfoValidationSchema,
    onSubmit: async (values: any) => {
      const requestData = {
        ...values,
        system_date_format: values?.system_date_format?.value,
      };

      for (const key in requestData) {
        if (requestData[key]) {
          requestData[key] = requestData[key];
        } else {
          requestData[key] = null;
        }
      }

      let res: any = await props.updateWaterSchemeDetailsAction(
        waterSchemeDetails?.system_date_format,
        waterSchemeDetails?.slug,
        requestData
      );

      if (res.status === 201 || res.status === 200) {
        toast.success(t("home:updateSuccess"));
        toggleModal();
      } else {
        const errors = Object.values(res.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }
    },
  });

  const toggleModal = () => setEdit(!edit);

  React.useEffect(() => {
    if (userDetails?.slug) {
      dispatch(getWaterSchemeDetailsAction(userDetails?.slug));
    }
  }, [userDetails]);

  React.useEffect(() => {
    if (waterSchemeDetails) {
      setInitialData({
        currency: waterSchemeDetails?.currency || "",
        location: waterSchemeDetails?.location,
        scheme_name: waterSchemeDetails?.scheme_name,
        system_built_date: formatDate(waterSchemeDetails?.system_built_date),
        longitude: waterSchemeDetails?.longitude,
        latitude: waterSchemeDetails?.latitude,
        water_source: waterSchemeDetails?.water_source,
        daily_target: "" + waterSchemeDetails?.daily_target,
        period: "" + waterSchemeDetails?.period || "",
        system_date_format:
          SYSTEM_DATE_FORMAT_OPTIONS?.find(
            (item) => item.value === waterSchemeDetails?.system_date_format
          ) || (null as any),
        tool_start_date: waterSchemeDetails?.tool_start_date,
      });
    }
  }, [waterSchemeDetails]);

  const handleCreateOption = (event) => {
    const waterDource: any = values.water_source;
    waterDource?.push({ label: event, value: event });
    setFieldValue("water_source", waterDource);
  };

  console.log(errors, "<<<<<<");

  return (
    <GeneralCard title={t("home:generalInformation")} className="text-left" action={toggleModal}>
      <div className="data-info">
        <h6 className="title">
          {t("home:scheme")} {t("home:name")}:{" "}
        </h6>
        <p className="desc">{waterSchemeDetails?.scheme_name}</p>
      </div>
      <div className="data-info">
        <h6 className="title">{t("home:location")}: </h6>
        <p className="desc">{waterSchemeDetails?.location}</p>
      </div>
      <div className="data-info">
        <h6 className="title">{t("home:waterSource")}: </h6>
        <p className="desc">{waterSchemeDetails?.water_source}</p>
      </div>

      <div className="data-info">
        <h6 className="title">
          {t("home:systemBuiltDate")}{" "}
          {/* <TooltipLabel
            id={"sbdate"}
            text={`Calendar date on which a Water System was built.It does not affect the book 
keeping or in any financial projection.`}
          /> */}
        </h6>
        <p className="desc">
          {getNumberByLanguage(
            new Date(waterSchemeDetails?.system_built_date)?.toLocaleDateString()
          )}
        </p>
      </div>

      <GeneralModal
        open={edit}
        toggle={toggleModal}
        title={t("home:editGeninfo")}
        size="xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="verticalForm"
        >
          <div className="row">
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:scheme")} {t("home:name")}:
                </label>

                <input
                  className="form-control"
                  name="scheme_name"
                  value={values.scheme_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="scheme_name" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:location")}:
                </label>

                <input
                  className="form-control"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="location" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:waterSource")}{" "}
                  <TooltipLabel
                    id={"sowsas"}
                    text={t("home:waterTool")}
                  />
                  :
                </label>

                <input
                  className="form-control"
                  name="water_source"
                  value={values.water_source}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <FormikValidationError name="water_source" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:dailytarget")} {t("home:liter")} {" "}
                  <TooltipLabel
                    id={"twspd"}
                    text={t("home:dailyTrgt")}
                  />
                  :
                </label>

                <input
                  className="form-control"
                  name="daily_target"
                  type="number"
                  value={values.daily_target}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="daily_target" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:vsf")} {" "}
                  <TooltipLabel
                    id={"sbdates"}
                    text={t("home:visualizeData")}
                  />
                  :
                </label>

                <input
                  className="form-control"
                  name="period"
                  type="number"
                  value={values.period}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="period" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:currency")}{" "}
                  <TooltipLabel id={"curr"} text={t("home:curren")} />:
                </label>

                <input
                  className="form-control"
                  name="currency"
                  type="text"
                  value={values.currency}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="currency" errors={errors} touched={touched} />
              </div>
            </div>

            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:systemDateFormat")}{" "}
                  <TooltipLabel
                    id={"systemDateFormat"}
                    text={t("home:sdf")}
                  />
                  :
                </label>

                <StyledSelect
                  name="system_date_format"
                  value={values?.system_date_format}
                  options={SYSTEM_DATE_FORMAT_OPTIONS}
                  onChange={({ name, value }) => {
                    setFieldValue(name, value);
                  }}
                  onBlur={() => {
                    setFieldTouched("system_date_format", true);
                  }}
                />
                <FormikValidationError name="location" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:systemBuiltDate")}{" "}
                  <TooltipLabel
                    id={"sbdate"}
                    text={t("home:sbd")}
                  />
                  :
                </label>

                {values.system_date_format?.value === "nep" ? (
                  <>
                    <NepaliDatePicker
                      value={values.system_built_date}
                      name="system_built_date"
                      onChange={(e) => {
                        setFieldValue("system_built_date", e);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <EnglishDatePicker
                      name="system_built_date"
                      value={values.system_built_date}
                      handleChange={(e) => {
                        setFieldValue("system_built_date", formatDate(e));
                      }}
                    />
                  </>
                )}
                <FormikValidationError name="system_built_date" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:longitude")}:
                </label>

                <input
                  className="form-control"
                  name="longitude"
                  type="text"
                  value={values.longitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <FormikValidationError name="longitude" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:latitude")}:
                </label>

                <input
                  className="form-control"
                  name="latitude"
                  type="text"
                  value={values.latitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <FormikValidationError name="latitude" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("home:toolStartDate")}{" "}
                  <TooltipLabel
                    id={"tsdate"}
                    text={t("home:tsd")}
                  />
                  :
                </label>

                {values.system_date_format?.value === "nep" ? (
                  <>
                    <NepaliDatePicker
                      value={values.tool_start_date}
                      name="tool_start_date"
                      onChange={(e) => {
                        setFieldValue("tool_start_date", e);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <EnglishDatePicker
                      name="tool_start_date"
                      value={values.tool_start_date}
                      handleChange={(e) => {
                        setFieldValue("tool_start_date", formatDate(e));
                      }}
                    />
                  </>
                )}
                <FormikValidationError name="location" errors={errors} touched={touched} />
              </div>
            </div>

            <div className="col-12 text-right mt-5">
              <Button
                className="btn custom-btn  mr-3"
                text={t("home:save")}
                type="submit"
                loading={props.buttonLoading}
                disabled={props.buttonLoading}
              />
              <Button
                className="btn custom-btn-outlined mr-3"
                text={t("home:cancel")}
                type="button"
                onClick={toggleModal}
              />
            </div>
          </div>
        </form>
      </GeneralModal>
    </GeneralCard>
  );
};

const mapStateToProps = (state: RootState) => ({
  buttonLoading: state.waterSchemeData.updateWaterSchemeDetails.isFetching,
});

const mapDispatchToProps = {
  updateWaterSchemeDetailsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(GeneralInfo);
