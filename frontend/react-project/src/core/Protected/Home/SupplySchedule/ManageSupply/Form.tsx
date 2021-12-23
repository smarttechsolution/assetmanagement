import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import TimeFromTo from "components/UI/Forms/InputGroup/TimeFromTo";
import { useFormik } from "formik";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getSupplyBeltsAction } from "store/modules/supplyBelts/getWaterSupplyBelts";
import { getWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/getWaterSupplySchedule";
import { postWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/postSupplySchedule";
import { updateWaterSupplyScheduleAction } from "store/modules/waterSupplySchedule/updateSupplySchedule";
import { RootState } from "store/root-reducer";
import { formatTime } from "utils/utilsFunction/format-time";
import { supplyBeltInitialValues, supplyBeltValidationSchema } from "./schema";
import { useTranslation } from "react-i18next";

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
}

const Form = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const [suppltBeltOptions, setSupplyBeltOptions] = React.useState<OptionType[]>([]);
  const [initialData, seetInitialData] = React.useState(supplyBeltInitialValues);

  React.useEffect(() => {
    if (props.schemeSlug && props.language) {
      props.getSupplyBeltsAction(props.language, props.schemeSlug);
    }
  }, [props.language]);

  React.useEffect(() => {
    if (props.supplyBelts) {
      const options = props.supplyBelts.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setSupplyBeltOptions(options);
    }
  }, [props.supplyBelts]);

  React.useEffect(() => {
    if (props.editData) {
      seetInitialData({
        ...props.editData,
        supply_belts: suppltBeltOptions.find((item) => item?.value === props.editData.supply_belts),
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
        morning_from_time: formatTime(submitValue.morning_from_time),
        morning_to_time: formatTime(submitValue.morning_to_time),
        evening_from_time: formatTime(submitValue.evening_from_time),
        evening_to_time: formatTime(submitValue.evening_to_time),
        supply_belts: submitValue.supply_belts?.value,
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
          seetInitialData(supplyBeltInitialValues);
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="" className="mr-1 ">
              {t("home:day")}
            </label>

            <input className="form-control" name="day" value={values.day} onChange={handleChange} />
            <FormikValidationError name="day" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="" className="mr-1 ">
              {t("home:supplyBelt")}
            </label>

            <StyledSelect
              name="supply_belts"
              value={values.supply_belts}
              options={suppltBeltOptions}
              onChange={({ name, value }) => {
                setFieldValue(name, value);
              }}
            />
            <FormikValidationError name="supply_belts" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-6">
          <TimeFromTo
            label={`${t("home:morning")}: `}
            from_name="morning_from_time"
            to_name="morning_to_time"
            setFieldValue={setFieldValue}
            values={values}
          />
          {errors.morning_from_time ? (
            <FormikValidationError name="morning_from_time" errors={errors} touched={touched} />
          ) : errors.morning_to_time ? (
            <FormikValidationError name="morning_to_time" errors={errors} touched={touched} />
          ) : null}
        </div>
        <div className="col-md-6">
          <TimeFromTo
            label={`${t("home:evening")}: `}
            name="from"
            from_name="evening_from_time"
            to_name="evening_to_time"
            setFieldValue={setFieldValue}
            values={values}
          />
          {errors.evening_from_time ? (
            <FormikValidationError name="evening_from_time" errors={errors} touched={touched} />
          ) : errors.evening_to_time ? (
            <FormikValidationError name="evening_to_time" errors={errors} touched={touched} />
          ) : null}
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
              className="btn custom-btn-outlined mr-3"
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
  supplyBelts: state.supplyBeltsData.getSupplyBeltData.data,
  postLoading: state.waterSupplyData.postWaterScheduleData.isFetching,
  updateLoading: state.waterSupplyData.updateWaterScheduleData.isFetching,
});

const mapDispatchToProps = {
  getSupplyBeltsAction,
  postWaterSupplyScheduleAction,
  getWaterSupplyScheduleAction,
  updateWaterSupplyScheduleAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Form);
