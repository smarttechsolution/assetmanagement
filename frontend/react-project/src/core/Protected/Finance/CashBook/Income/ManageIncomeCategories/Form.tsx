import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getIncomeCategoryAction } from "store/modules/income/getIncomeCategory";
import { postIncomeCategoriesAction } from "store/modules/income/postIncomeCategories";
import { updateIncomeCategoriesAction } from "store/modules/income/updateIncomeCategories";
import { RootState } from "store/root-reducer";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const validationScheme = Yup.object({
  name: Yup.string().required("Name is required"),
});

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any;
}

const Form = (props: Props) => {
  const { t } = useTranslation();
  const [initialData, setInitialData] = React.useState({
    name: "",
  });

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
      });
    }
  }, [props.editData]);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: validationScheme,
    onSubmit: async (submitValue, { resetForm }) => {
      const requestData = submitValue;

      let res;
      if (props.editData) {
        res = await props.updateIncomeCategoriesAction(props.editData.id, requestData);
      } else {
        res = await props.postIncomeCategoriesAction(requestData);
      }

      if (res.status === 201 || res.status === 200) {
        if (res.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          setInitialData({
            name: "",
          });
          toast.success(t("home:updateSuccess"));
        }
        props.setEditData(null);
        props.getIncomeCategoryAction(props.schemeSlug);
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
      <div className="row align-items-center">
        <div className="col-md-8">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:categoryName")}
            </label>

            <input
              className="form-control"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="name" errors={errors} touched={touched} />
          </div>
        </div>

        <div className="col-md-4 text-right">
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
  supplySchedule: state.waterSupplyData.waterScheduleData.data,
  supplyBelts: state.supplyBeltsData.getSupplyBeltData.data,
  postLoading: state.incomeData.postIncome.isFetching,
  updateLoading: state.incomeData.updateIncome.isFetching,
});

const mapDispatchToProps = {
  updateIncomeCategoriesAction,
  postIncomeCategoriesAction,
  getIncomeCategoryAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Form);
