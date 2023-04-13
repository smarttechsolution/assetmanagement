import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import { Form, useFormik } from "formik";
import React from "react";
import Button from "components/UI/Forms/Buttons";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import { postOtherExpensesAction } from "store/modules/otherExpenses/postOtherExpenses";
import toast from "components/React/ToastNotifier/ToastNotifier";
import { updateOtherExpensesAction } from "store/modules/otherExpenses/updateOtherExpenses";
import { getOtherExpensesAction } from "store/modules/otherExpenses/getOtherExpenses";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import formatDate from "utils/utilsFunction/date-converter";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import { EXPENSE_CATTEGORY } from "constants/constants";
import CustomRadio from "components/UI/CustomRadio";
import TooltipLabel from "components/UI/TooltipLabel";

const validationSchema = Yup.object({
  apply_date: Yup.string().required("This field is required"),
  title: Yup.string().required("This field is required"),
  yearly_expense: Yup.string().required("This field is required"),
  category: Yup.string().required("This field is required"),
  apply_for_specific_date: Yup.boolean().required("This field is required"),
});

interface Props extends PropsFromRedux {
  editData: any;
  setEditData: any;
}

const OtherExpenseForm = (props: Props) => {
  const { t } = useTranslation();
  const [initialData, setInitialData] = React.useState({
    apply_date: "",
    category: "" as OptionType | string,
    title: "",
    yearly_expense: "",
    apply_for_specific_date: true,
    one_time_cost: false,
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleReset,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      let response;

      if (props.editData) {
        response = await props.updateOtherExpensesAction(props.language, props.editData.id, values);
      } else {
        response = await props.postOtherExpensesAction(props.language, values);
      }

      if (response.status === 201 || response.status === 200) {
        if (response.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
          props.getOtherExpensesAction(props.language);
        } else {
          setInitialData({
            apply_date: "",
            category: "",
            title: "",
            yearly_expense: "",
            apply_for_specific_date: true,
            one_time_cost: true,
          });
          props.setEditData(null)
          props.getOtherExpensesAction(props.language);
          toast.success(t("home:updateSuccess"));
        }
      }
      if (response.status === 400){
        const errors = Object.values(response.data)?.map((item: any) => {
          toast.error(item[0]);
        });
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

  // const handleReset = () => {
  //   // var enDatePicker = document.getElementById("enDate") as HTMLInputElement | null;

  //   if(values.apply_date != ""){
  //     setInitialData()
  //   }
  // }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
      id="otherexpenses"
    >
      <div className="row rate_form align-items-center">
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:applyDate")}{" "}
              <TooltipLabel id={"apd"} text={t("home:appdate")} />:
            </label>

            {props.scheme?.system_date_format === "nep" ? (
              <>
                <NepaliDatePicker
                  value={values.apply_date}
                  name="apply_date"
                  id="neDate"
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
                  id= "enDate"
                  handleChange={(e) => {
                    setFieldValue("apply_date", formatDate(e));
                  }}
                />
              </>
            )}
            <FormikValidationError name="date" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:expenseHeading")} :
            </label>

            <input
              className="form-control"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="title" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="" className="mr-1">
              {t("finance:yearlyExpnd")} ({props.currency}):
            </label>

            <input
              className="form-control"
              name="yearly_expense"
              type="number"
              value={values.yearly_expense}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="yearly_expense" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="" className="mr-1">
              {t("finance:transactionType")} :
            </label>

            <StyledSelect
              name="category"
              value={EXPENSE_CATTEGORY?.find((item) => item.value === values.category) || null}
              options={EXPENSE_CATTEGORY}
              onChange={({ name, value }: any) => {
                setFieldValue(name, value?.value);
              }}
            />
            <FormikValidationError name="yearly_expense" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="" className="mr-1">
              {t("finance:afsd")} :
            </label>

            <div className="d-flex">
              <div className="mr-2">
                <CustomRadio
                  label={"Yes"}
                  id="yes"
                  name="apply_for_specific_date"
                  value={1}
                  checked={values.apply_for_specific_date === true}
                  onChange={(e) => setFieldValue("apply_for_specific_date", true)}
                  tooltipData={t("home:ifyes")}
                />
              </div>
              <div className="ml-2">
                <CustomRadio
                  label={"No"}
                  id="no"
                  name="apply_for_specific_date"
                  value={2}
                  checked={values.apply_for_specific_date === false}
                  onChange={(e) => setFieldValue("apply_for_specific_date", false)}
                  tooltipData={t("home:ifno")}
                />
              </div>
            </div>

            <FormikValidationError name="yearly_expense" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="" className="mr-1">
              {t("finance:oneTimeCost")} :
            </label>

            <div className="d-flex">
              <div className="mr-2">
                <CustomRadio
                  label={"Yes"}
                  id="noOTC"
                  name="one_time_cost"
                  value={2}
                  checked={values.one_time_cost === false}
                  onChange={(e) => setFieldValue("one_time_cost", false)}
                />
              </div>
              <div className="ml-2">
                <CustomRadio
                  label={"No (One Time)"}
                  id="yesOTC"
                  name="one_time_cost"
                  value={1}
                  checked={values.one_time_cost === true}
                  onChange={(e) => setFieldValue("one_time_cost", true)} />
              </div>
            </div>

            <FormikValidationError name="yearly_expense" errors={errors} touched={touched} />
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
            className="btn custom-btn-outlined mr-3"
            text={t("home:cancel")}
            type='reset'
            onClick={() => {
              const resetKeys: any = Object.keys(initialData).reduce((acc, curr) => {
                acc[curr] = '';
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
  postLoading: state.otherExpensesData.postTestParameters.isFetching,
  updateLoading: state.otherExpensesData.updateTestParameters.isFetching,
  currency: state.waterSchemeData.waterSchemeDetailsData.data?.currency
});

const mapDispatchToProps = {
  postOtherExpensesAction: postOtherExpensesAction,
  updateOtherExpensesAction: updateOtherExpensesAction,
  getOtherExpensesAction: getOtherExpensesAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(OtherExpenseForm);
