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

const validationScheme = Yup.object({
  category: Yup.mixed().required("This field is required"),
  date: Yup.string().required("This field is required"),
  title: Yup.string().required("This field is required"),
  income_amount: Yup.string().required("This field is required"),
  remarks: Yup.string(),
});

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any;
  activeDate?: string;
}

const ExpenseForm = (props: Props) => {
  const { t } = useTranslation();

  const [initialData, setInitialData] = React.useState({
    category: null as OptionType | null,
    date: "",
    title: "",
    income_amount: "",
    remarks: "",
  });
  const [categoryOption, setCategoryOptions] = React.useState<OptionType[]>();

  React.useEffect(() => {
    if (props.schemeSlug) {
      getIncomeCategoryAction(props.schemeSlug);
    }
  }, [props.schemeSlug]);

  React.useEffect(() => {
    if (props.expenseCategories) {
      const options = props.expenseCategories?.map((item) => ({
        label: item.name,
        value: item.id,
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
      const requestData = { ...submitValue, category: submitValue?.category?.value };

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
          setInitialData({
            category: null,
            date: "",
            title: "",
            income_amount: "",
            remarks: "",
          });
          toast.success(t("home:updateSuccess"));
        }
        props.toggle(false);
        props.setEditData(null);
        fetCashbookDetails();
      } else {
        const errors = Object.values(res.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }
    },
  });

  const fetCashbookDetails = () => {
    props.getExpenditureAction(
      props.language,
      props.schemeSlug,
      props.activeDate?.split("-")[0] ||
        getDefaultDate(props.scheme?.system_date_format)?.split("-")[0],
      props.activeDate?.split("-")[1] ||
        getDefaultDate(props.scheme?.system_date_format)?.split("-")[1]
    );
    props.getExpenditureCategoryAction(props.schemeSlug);
    props.getPreviousExpenditureTotalAction(
      props.language,
      props.schemeSlug,
      props.activeDate?.split("-")[0] ||
        getDefaultDate(props.scheme?.system_date_format)?.split("-")[0],
      props.activeDate?.split("-")[1] ||
        getDefaultDate(props.scheme?.system_date_format)?.split("-")[1]
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row align-items-center">
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
          <div className="form-group ">
            <div className="form-group">
              <label htmlFor="" className="mr-1">
                {t("finance:title")} ::
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
            className="btn custom-btn  mr-3"
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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ExpenseForm);
