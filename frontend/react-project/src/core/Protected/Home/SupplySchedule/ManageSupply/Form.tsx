import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import TooltipLabel from "components/UI/TooltipLabel";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/getWaterSupplySchedule";
import { postWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/postSupplySchedule";
import { updateWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/updateSupplySchedule";
import { RootState } from "store/root-reducer";
import { initialValues, validationSchema } from "./schema";

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any
}

const Form = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const [initialData, setInitialData] = React.useState(initialValues);

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
        time_from: new Date().setHours(
          props.editData.time_from?.split(":")[0],
          props.editData.time_from?.split(":")[1]
        ),
        time_to: new Date().setHours(
          props.editData.time_to?.split(":")[0],
          props.editData.time_to?.split(":")[1]
        ),
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
    validationSchema: validationSchema,
    onSubmit: async (submitValue, { resetForm }) => {
      const requestData = {
        ...submitValue,
        time_from: formatTime(submitValue.time_from),
        time_to: formatTime(submitValue.time_to),
      };
      let res;
      if (props.editData) {
        res = await props.updateWaterSupplyScheduleAction(
          props.language,
          props.editData.id,
          requestData
        );
      } else {
        res = await props.postWaterSupplyScheduleAction(props.language, requestData);
      }

      console.log(res, "resss");

      if (res.status === 201 || res.status === 200) {
        if (res.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          setInitialData(initialValues);
          props.setEditData(null)
          toast.success(t("home:updateSuccess"));
        }

        props.getWaterSupplyScheduleAction(props.language, props.schemeSlug);
      } else {
        const errors = Object.values(res.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }
    },
  });

  const formatTime = (time) => {
    const receivedTime = new Date(time).toTimeString();
    return receivedTime.split(" ")[0];
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="" className="mr-1 ">
              {t("home:dayoftheweek")} 
              <TooltipLabel id="dayofweek" text={t("home:dayofweek")}/>
            </label>

            <input className="form-control" name="day" value={values.day} onChange={handleChange} />
            <FormikValidationError name="day" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="" className="mr-1 ">
              {t("home:timeFrom")}
            </label>

            <EnglishDatePicker
              name="time_from"
              value={values.time_from}
              handleChange={(e) => {
                setFieldValue("time_from", e);
              }}
              showTimeSelect={true}
              showTimeSelectOnly={true}
              dateFormat="HH:mm"
              timeIntervals={15}
            />

            <FormikValidationError name="time_from" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="" className="mr-1 ">
              {t("home:timeTo")}
            </label>
            <EnglishDatePicker
              name="time_to"
              value={values.time_to}
              handleChange={(e) => {
                setFieldValue("time_to", e);
              }}
              showTimeSelect={true}
              showTimeSelectOnly={true}
              dateFormat="HH:mm"
              timeIntervals={15}
            />

            <FormikValidationError name="time_to" errors={errors} touched={touched} />
          </div>
        </div>



        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="" >
              {t("home:comment")}
            </label>

            <input className="form-control" name="comment" value={values.comment} onChange={handleChange} />
            <FormikValidationError name="comment" errors={errors} touched={touched} />
          </div>
        </div>




        <div className="col-12 text-right">
          <div className="pl-md-5 mt-3">
            <Button
              className="btn custom-btn  mr-3"
              text={t("home:save")}
              disabled={props.postLoading || props.updateLoading}
              loading={props.postLoading || props.updateLoading}
            />
            <Button
              className="btn custom-btn-outlined"
              text={t("home:cancel")}
              onClick={() => props.toggle()}
              type="button"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  supplySchedule: state.waterSupplyData.waterScheduleData.data,
  postLoading: state.waterSupplyData.postWaterScheduleData.isFetching,
  updateLoading: state.waterSupplyData.updateWaterScheduleData.isFetching,
});

const mapDispatchToProps = {
  postWaterSupplyScheduleAction,
  getWaterSupplyScheduleAction,
  updateWaterSupplyScheduleAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Form);
