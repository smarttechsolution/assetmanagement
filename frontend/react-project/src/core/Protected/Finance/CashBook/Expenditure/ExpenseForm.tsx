import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getExpenditureAction } from "store/modules/expenditure/getExpenditure";
import { getExpenditureCategoryAction } from "store/modules/expenditure/getExpenditureCategory";
import { getPreviousExpenditureTotalAction } from "store/modules/expenditure/getPreviousExpenditureTotal";
import { postExpenseAction } from "store/modules/expenditure/postExpense";
import { updateExpenditureAction } from "store/modules/expenditure/updateExpense";
import { getIncomeCategoryAction } from "store/modules/income/getIncomeCategory";
import { RootState } from "store/root-reducer";
import formatDate, { getDefaultDate } from "utils/utilsFunction/date-converter";
import * as Yup from "yup";
import { geAllExpenditureAction } from "store/modules/expenditure/getAllExpenditure";

const validationScheme = Yup.object({
  category: Yup.mixed().required("This field is required"),
  date: Yup.string().required("This field is required"),
  title: Yup.string().required("This field is required"),
  income_amount: Yup.string().required("This field is required"),
  remarks: Yup.string().required("This field is required"),
});

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any;
  activeDate?: string;
}

const initialFormData = {
  category: null as any,
  date: "",
  title: "",
  income_amount: 0,
  labour_cost: 0,
  consumables_cost: 0,
  replacement_cost: 0,
  remarks: "",
  is_cost_seggregated: false,
};

const ExpenseForm = (props: Props) => {
  const { t } = useTranslation();

  const [initialData, setInitialData] = React.useState(initialFormData);
  const [categoryOption, setCategoryOptions] = React.useState<OptionType[]>();

  React.useEffect(() => {
    if (props.schemeSlug) {
      getIncomeCategoryAction(props.schemeSlug);
    }
  }, [props.schemeSlug]);

  React.useEffect(() => {
    if (props.expenseCategories) {
      const options = props.expenseCategories?.map((item: any) => ({
        label: item.name,
        value: item.id,
        e_name: item.e_name,
      }));
      setCategoryOptions(options);
    }
  }, [props.expenseCategories]);

  React.useEffect(() => {
    if (props.activeDate) {
      setInitialData({
        ...initialData,
        date: props.activeDate,
      });
    }
  }, [props.activeDate]);

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
        category: { label: props.editData?.category?.name, value: props.editData?.category?.id },
      });
    }
  }, [props.editData]);

  const {
    values,
    errors,
    setFieldTouched,
    setFieldValue,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: validationScheme,
    onSubmit: async (submitValue, { resetForm }) => {
      let requestData: any = { ...submitValue, category: submitValue?.category?.value };
      if (values?.category?.e_name === "Maintenance" && values?.is_cost_seggregated) {
        requestData.income_amount =
          Number(values?.consumables_cost) +
          Number(values?.labour_cost) +
          Number(values?.replacement_cost);
      }

      delete requestData.is_cost_seggregated;

      let res;
      if (props.editData) {
        res = await props.updateExpenditureAction(props.language, props.editData.id, requestData);
      } else {
        res = await props.postExpenseAction(props.language, requestData);
      }

      if (res.status === 201 || res.status === 200) {
        if (res.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          setInitialData(initialFormData);
          toast.success(t("home:updateSuccess"));
        }
        props.toggle(false);
        props.setEditData(null);
        props.getExpenditureAction(props.language, props.schemeSlug);
        props.geAllExpenditureAction(props.language, props.schemeSlug);

        props.getExpenditureCategoryAction(props.schemeSlug);
        props.getPreviousExpenditureTotalAction(
          props.language,
          props.schemeSlug,
          props.activeDate?.split("-")[0] ||
            getDefaultDate(props.scheme?.system_date_format)?.split("-")[0],
          props.activeDate?.split("-")[1] ||
            getDefaultDate(props.scheme?.system_date_format)?.split("-")[1]
        );
      } else {
        const errors = Object.values(res.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }
    },
  });

  console.log(values, "<<<<<");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row align-items-end">
        <div className="col-md-12">
          <div className="form-group ">
            <div className="form-group">
              <label htmlFor="" className="mr-1">
                {t("finance:category")} :
              </label>

              <StyledSelect
                name="category"
                value={values.category}
                options={categoryOption}
                onChange={({ name, value }) => {
                  setFieldValue(name, value);
                }}
                onBlur={() => {
                  setFieldTouched("category", true);
                }}
              />

              <FormikValidationError name="category" errors={errors} touched={touched} />
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-group ">
            <div className="form-group">
              <label htmlFor="" className="mr-1">
                {t("finance:date")} :
              </label>

              {props.scheme?.system_date_format === "nep" ? (
                <>
                  <NepaliDatePicker
                    value={values.date}
                    name="date"
                    onChange={(e) => {
                      setFieldValue("date", e);
                    }}
                  />
                </>
              ) : (
                <>
                  <EnglishDatePicker
                    name="date"
                    value={values.date}
                    handleChange={(e) => {
                      setFieldValue("date", formatDate(e));
                    }}
                  />
                </>
              )}
              <FormikValidationError name="date" errors={errors} touched={touched} />
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-group ">
            <div className="form-group">
              <label htmlFor="" className="mr-1">
                {t("finance:title")} :
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
        </div>

        {!values?.is_cost_seggregated && (
          <div className="col-md-12">
            <div className="form-group ">
              <div className="form-group">
                <label htmlFor="" className="mr-1">
                  {t("finance:amount")} :
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="income_amount"
                  value={values.income_amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="income_amount" errors={errors} touched={touched} />
              </div>
            </div>
          </div>
        )}
        {values?.category?.e_name === "Maintenance" && (
          <div className="col-lg-4">
            <div className="form-group ">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexCheckChecked"
                  name="is_cost_seggregated"
                  checked={values.is_cost_seggregated}
                  onChange={(e) => {
                    setFieldValue("is_cost_seggregated", e.target.checked);
                    setFieldValue("income_amount", 0);
                  }}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  {t("finance:icCostSegregated")}
                </label>
              </div>

              <FormikValidationError name="is_cost_seggregated" errors={errors} touched={touched} />
            </div>
          </div>
        )}

        {values?.category?.e_name === "Maintenance" && values?.is_cost_seggregated && (
          <div className="col-md-12">
            <div className="form-group ">
              <div className="form-group">
                <label htmlFor="" className="mr-1">
                  {t("home:labour")} {t("home:cost")}:
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="labour_cost"
                  value={values.labour_cost}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="labour_cost" errors={errors} touched={touched} />
              </div>
            </div>
          </div>
        )}
        {values?.category?.e_name === "Maintenance" && values?.is_cost_seggregated && (
          <div className="col-md-12">
            <div className="form-group ">
              <div className="form-group">
                <label htmlFor="" className="mr-1">
                  {t("home:consumable")} {t("home:cost")}:
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="consumables_cost"
                  value={values.consumables_cost}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="consumables_cost" errors={errors} touched={touched} />
              </div>
            </div>
          </div>
        )}

        {values?.category?.e_name === "Maintenance" && values?.is_cost_seggregated && (
          <div className="col-md-12">
            <div className="form-group ">
              <div className="form-group">
                <label htmlFor="" className="mr-1">
                  {t("home:replacement")} {t("home:cost")}:
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="replacement_cost"
                  value={values.replacement_cost}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="replacement_cost" errors={errors} touched={touched} />
              </div>
            </div>
          </div>
        )}
        <div className="col-md-12">
          <div className="form-group ">
            <div className="form-group">
              <label htmlFor="" className="mr-1">
                {t("finance:remarks")} :
              </label>

              <input
                type="text"
                className="form-control"
                name="remarks"
                value={values.remarks}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormikValidationError name="remarks" errors={errors} touched={touched} />
            </div>
          </div>
        </div>

        <div className="col-md-12 text-right">
          <Button
            className="btn custom-btn "
            text={t("home:save")}
            type="submit"
            disabled={props.postLoading || props.updateLoading}
            loading={props.postLoading || props.updateLoading}
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
  expenseCategories: state.expenditureData.getExpenditureCategory.data,
  postLoading: state.expenditureData.postExpense.isFetching,
  updateLoading: state.expenditureData.updateExpense.isFetching,
});

const mapDispatchToProps = {
  getExpenditureAction,
  updateExpenditureAction,
  postExpenseAction,
  getExpenditureCategoryAction,
  getPreviousExpenditureTotalAction,
  geAllExpenditureAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ExpenseForm);
