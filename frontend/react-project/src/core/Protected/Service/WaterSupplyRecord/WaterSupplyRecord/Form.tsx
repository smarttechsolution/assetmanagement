import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getWaterSupplyRecordAction } from "store/modules/waterSupplyRecord/getWaterSupplyRecord";
import { postWaterSupplyRecordAction } from "store/modules/waterSupplyRecord/postWaterSupplyRecord";
import { postWaterSupplyRecordA } from "store/modules/waterSupplyRecord/postSupplyRecordA";

import { updateWaterSupplyRecordAction } from "store/modules/waterSupplyRecord/updateWaterSupplyRecord";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
import { waterSupplyRecordInitialValues, waterSupplyRecordValidationSchema } from "./schema";
import CustomCheckBox from "components/UI/CustomCheckbox";
import TooltipLabel from "components/UI/TooltipLabel";


interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any;
}

const Form = (props: Props) => {
  const { t } = useTranslation();

  const [initialData, setInitialData] = React.useState<typeof waterSupplyRecordInitialValues>(
    waterSupplyRecordInitialValues
  );

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
    handleSubmit,
    setFieldTouched,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: waterSupplyRecordValidationSchema,
    onSubmit: async (submitValue, { resetForm }) => {
      let res;
      if (props.editData) {
        res = await props.updateWaterSupplyRecordAction(props.language, props.editData.id, {
          ...submitValue,
        });
      } else {
        res = await props.postWaterSupplyRecordA(props.language, {
          ...submitValue,
          
        });
      }
      if (res.status === 201 || res.status === 200) {
        if (res.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          props.setEditData(null);
          setInitialData(waterSupplyRecordInitialValues);
          toast.success(t("home:updateSuccess"));
        }
        props.getWaterSupplyScheduleAction(props.language);
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
      <div className="row align-items-start">
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:totalSupply")} {t("home:inliters")} :
            </label>

            <input
              className="form-control"
              name="total_supply"
              value={values.total_supply}
              defaultValue={values.total_supply}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="total_supply" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:supplyDate")} :
            </label>

            {props.schemeDetails?.system_date_format === "nep" ? (
              <NepaliDatePicker
                className="form-control"
                name="date_from"
                value={values.date_from}
                onChange={(e) => {
                  setFieldValue("date_from", e);
                }}
              />
            ) : (
              <EnglishDatePicker
                name="date_from"
                value={values.date_from}
                handleChange={(e) => {
                  setFieldValue("date_from", formatDate(e));
                }}
              />
            )}
            <FormikValidationError name="date_from" errors={errors} touched={touched} />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group mt-5 d-flex">
            <CustomCheckBox
              id={"date_to"}
              label={t("finance:issupplyendate")}
              // checked={values.date_to}
              onChange={(e) => setFieldValue("supplyendDate", e.target.checked)} />
              <TooltipLabel id="checksupplydate"  text={t("home:cSupplyDate")} />
          </div>
        </div>
        {values.supplyendDate && (
          <div className="col-lg-3">
            <div className="form-group ">
              <label htmlFor="" className="mr-1">
                {t("home:supplyendDate")} :
              </label>

              {props.schemeDetails?.system_date_format === "nep" ? (
              <NepaliDatePicker
                className="form-control"
                name="date_to"
                value={values.date_to}
                onChange={(e) => {
                  setFieldValue("date_to", e);
                }}
              />
            ) : (
              <EnglishDatePicker
                name="date_to"
                value={values.date_to}
                handleChange={(e) => {
                  setFieldValue("date_to", formatDate(e));
                }}
              />
            )}
              <FormikValidationError name="date_to" errors={errors} touched={touched} />
            </div>
          </div>
        )}

        <div className="col-md-12 text-right">
          <Button
            className="btn custom-btn  mr-2"
            text={t("home:save")}
            disabled={props.loading}
            loading={props.loading}
          />
          <Button 
            className="btn custom-btn-outlined mr-3"
            text={t("home:cancel")}
            type="reset"
            onClick={() => {
              const resetKeys: any = Object.keys(initialData).reduce((acc, curr) => {
                acc[curr] = '';
                return acc;
              }, {});
              // console.log(resetKeys,'0000000000000000000000000000000000000000000000000');
              setInitialData(resetKeys)
              props.setEditData(null)
            }}
          />
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  loading:
    state.testParamtersData.postTestParameters.isFetching ||
    state.testParamtersData.updateTestParameters.isFetching,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
});

const mapDispatchToProps = {
  getWaterSupplyScheduleAction: getWaterSupplyRecordAction,
  updateWaterSupplyRecordAction: updateWaterSupplyRecordAction,
  postWaterSupplyRecordAction: postWaterSupplyRecordAction,
  postWaterSupplyRecordA: postWaterSupplyRecordA
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Form);
