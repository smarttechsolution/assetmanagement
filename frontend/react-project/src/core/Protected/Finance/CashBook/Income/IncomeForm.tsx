import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getIncomeAction } from "store/modules/income/getIcome";
import { getIncomeCategoryAction } from "store/modules/income/getIncomeCategory";
import { postIncomeAction } from "store/modules/income/postIncome";
import { updateIncomeAction } from "store/modules/income/updateIncome";
import { RootState } from "store/root-reducer";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import formatDate, { getDefaultDate } from "utils/utilsFunction/date-converter";
import { getPreviousIncomeTotalAction } from "store/modules/income/getPreviousIncomeTotal";
import { geAllIncomeAction } from "store/modules/income/getAllIncome";
import { getIncomeTotalAction } from "store/modules/income/getIncomeTotal";


const validationScheme = Yup.object({
  category: Yup.mixed().required("This field is required"),
  date: Yup.string().required("This field is required"),
  title: Yup.string().required("This field is required"),
  income_amount: Yup.string().required("This field is required"),
  water_supplied: Yup.string().nullable(),
});

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any;
  activeDate?: string;
}

const IncomeForm = (props: Props) => {
  const { t } = useTranslation();
  const [initialData, setInitialData] = React.useState({
    category: null as any,
    date: "",
    title: "",
    income_amount: "",
    water_supplied: "",
    remarks: "",
  });
  const [categoryOption, setCategoryOptions] = React.useState<OptionType[]>();

  React.useEffect(() => {
    if (props.schemeSlug) {
      getIncomeCategoryAction(props.schemeSlug);
    }
  }, [props.schemeSlug]);

  React.useEffect(() => {
    if (props.incomeCategories) {
      const options = props.incomeCategories?.map((item: any) => ({
        label: item.name,
        value: item.id,
        e_name: item.e_name,
      }));
      setCategoryOptions(options);
    }
  }, [props.incomeCategories]);

  React.useEffect(() => {
    if (props.editData) {

      console.log(props.editData, "editDataeditData")
      setInitialData({
        ...props.editData,
        category: { label: props.editData?.category?.name, value: props.editData?.category?.id, e_name: props.editData?.category?.e_name },
      });
    } else if (props.activeDate) {
      setInitialData({
        ...initialData,
        date: props.activeDate,
      });
    }
  }, [props.editData, props.activeDate]);

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
      let requestData: any = {
        ...submitValue,
        category: submitValue?.category?.value,
      };
      if (!values.water_supplied) delete requestData.water_supplied;
      let res;
      if (props.editData) {
        res = await props.updateIncomeAction(props.language, props.editData.id, requestData);
      } else {
        res = await props.postIncomeAction(props.language, requestData);
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
            water_supplied: "",
            remarks: "",
          });
          toast.success(t("home:updateSuccess"));
        }
        props.toggle(false);
        props.setEditData(null);
        props.geAllIncomeAction(props.language, props.schemeSlug)
        props.getIncomeAction(props.language, props.schemeSlug);
        props.getIncomeTotalAction(props.language, props.schemeSlug)

        props.getIncomeCategoryAction(props.schemeSlug);
        props.getPreviousIncomeTotalAction(
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

  console.log(values, "errors")

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
                {t("finance:category")} {}:
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
                {t("finance:title")}:
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
          {values?.category?.e_name === "Water Sales" && (
            <div className="form-group ">
              <div className="form-group">
                <label htmlFor="" className="mr-1">
                  {t("finance:waterSupplied")} :
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="water_supplied"
                  value={values.water_supplied}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="water_supplied" errors={errors} touched={touched} />
              </div>
            </div>
          )}

          <div className="form-group ">
            <div className="form-group">
              <label htmlFor="" className="mr-1">
                {t("finance:amount")} ({props.currency}):
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
                {t("home:remarks")}:
              </label>

              <input
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
            className="btn custom-btn mt-2"
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
  currency: state.waterSchemeData.waterSchemeDetailsData.data?.currency,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  incomeCategories: state.incomeData.getIncomeCategory.data,
  postLoading: state.incomeData.postIncome.isFetching,
  updateLoading: state.incomeData.updateIncome.isFetching,
});

const mapDispatchToProps = {
  getIncomeAction,
  updateIncomeAction,
  postIncomeAction,
  getIncomeCategoryAction,
  getPreviousIncomeTotalAction,
  geAllIncomeAction,
  getIncomeTotalAction,

};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(IncomeForm);
