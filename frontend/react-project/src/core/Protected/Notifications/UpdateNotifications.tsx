import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { GeneralCard } from "components/UI/GeneralCard";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getNotificationDetailsAction } from "store/modules/notifications/getNotifications";
import { postNotificationsAction } from "store/modules/notifications/postNotifications";
import { updateNotificationsAction } from "store/modules/notifications/updateNotifications";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
import { createNotificationInitialValues, createNotificationValidationSchema } from "./scheme";

interface Props extends PropsFromRedux {}

const GeneralInfo = (props: Props) => {
  const { t } = useTranslation("home");

  const [initialValues, setInitialValues] = React.useState<any>(createNotificationInitialValues);

  React.useEffect(() => {
    if (props.schemeDetails) {
      props.getNotificationDetailsAction(props.schemeDetails?.slug);
    }
  }, [props.schemeDetails]);

  React.useEffect(() => {
    if (
      props.notificationDetails &&
      props.notificationDetails instanceof Array &&
      props.notificationDetails[0]
    ) {
      setInitialValues(props.notificationDetails[0]);
    }
  }, [props.notificationDetails]);

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
    initialValues: initialValues,
    validationSchema: createNotificationValidationSchema,
    onSubmit: async (values: any, { resetForm }) => {
      let response;
      const requestData = {
        ...values,
        system_date_format: values?.system_date_format?.value,
      };
      if (props.notificationDetails && props.notificationDetails.length > 0) {
        response = await props.updateNotificationsAction(
          props.notificationDetails[0]?.id,
          requestData
        );
      } else {
        response = await props.postNotificationsAction(requestData);
      }

      console.log(response, "responsss");

      if (response.status === 201 || response.status === 200) {
        props.getNotificationDetailsAction(props.schemeDetails?.slug);
        toast.success("Notification Updated Successfully");
      } else {
        const errorList = response.data && response.data.error;
        if (errorList instanceof Array) {
          errorList.forEach((item) => {
            toast.error(item);
          });
        }
      }
    },
  });

  console.log(props.notificationDetails, "initialValuesinitialValues");

  return (
    <div className="container py-3 ">
      <div className="row">
        <div className="col-lg-12">
          <GeneralCard title={t("home:updateNotifications")} className="text-left">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="verticalForm"
            >
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group ">
                    <label htmlFor="" className="mr-1 ">
                      {t("home:initialDate")}:
                    </label>

                    {props.schemeDetails && props.schemeDetails.system_date_format === "nep" ? (
                      <>
                        <NepaliDatePicker
                          value={values.initial_date}
                          name="initial_date"
                          onChange={(e) => {
                            setFieldValue("initial_date", e);
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <EnglishDatePicker
                          name="initial_date"
                          value={values.initial_date}
                          handleChange={(e) => {
                            setFieldValue("initial_date", formatDate(e));
                          }}
                        />
                      </>
                    )}
                    <FormikValidationError name="initial_date" errors={errors} touched={touched} />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group ">
                    <label htmlFor="" className="mr-1 ">
                      {t("home:inp")} {t("home:inday")}:
                    </label>

                    <input
                      className="form-control"
                      name="income_notification_period"
                      value={values.income_notification_period}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormikValidationError
                      name="income_notification_period"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group ">
                    <label htmlFor="" className="mr-1 ">
                      {t("home:enp")} {t("home:inday")}:
                    </label>

                    <input
                      className="form-control"
                      name="expenditure_notification_period"
                      value={values.expenditure_notification_period}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormikValidationError
                      name="expenditure_notification_period"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group ">
                    <label htmlFor="" className="mr-1 ">
                      {t("home:trnp")} {t("home:inday")}:
                    </label>

                    <input
                      className="form-control"
                      name="test_result_notification_period"
                      value={values.test_result_notification_period}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormikValidationError
                      name="test_result_notification_period"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group ">
                    <label htmlFor="" className="mr-1 ">
                      {t("home:srnp")} {t("home:inday")}:
                    </label>

                    <input
                      className="form-control"
                      name="supply_record_notification_period"
                      value={values.supply_record_notification_period}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormikValidationError
                      name="supply_record_notification_period"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group ">
                    <label htmlFor="" className="mr-1 ">
                      {t("home:mnb")} {t("home:inday")}:
                    </label>

                    <input
                      className="form-control"
                      name="maintenance_notify_before"
                      value={values.maintenance_notify_before}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormikValidationError
                      name="maintenance_notify_before"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group ">
                    <label htmlFor="" className="mr-1 ">
                      {t("home:mna")} {t("home:inday")}:
                    </label>

                    <input
                      className="form-control"
                      name="maintenance_notify_after"
                      value={values.maintenance_notify_after}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormikValidationError
                      name="maintenance_notify_after"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-12 text-right mt-5">
                  <Button
                    className="btn custom-btn  mr-3"
                    text={t("home:save")}
                    type="submit"
                    disabled={props.loading}
                    loading={props.loading}
                  />
                </div>
              </div>
            </form>
          </GeneralCard>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  notificationDetails: state.notifications.getNotifications.data,
  loading: state.notifications.updateNotifications.isFetching,
});

const mapDispatchToProps = {
  updateNotificationsAction: updateNotificationsAction,
  getNotificationDetailsAction: getNotificationDetailsAction,
  postNotificationsAction: postNotificationsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(GeneralInfo);
