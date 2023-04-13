import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getComponentCategoriesAction } from "store/modules/componentCategories/getComponentCategories";
import { postComponentCategoriesAction } from "store/modules/componentCategories/postComponentCategories";
import { updateComponentCategoriesAction } from "store/modules/componentCategories/updateComponentCategories";
import { RootState } from "store/root-reducer";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const validationSchema = Yup.object({
  name: Yup.string().required("This field is required"),
});

interface Props extends PropsFromRedux {
  editData: any;
  setEditData: any;
}

const CategoriesForm = (props: Props) => {
  const { t } = useTranslation();
  const [initialData, setInitialData] = React.useState({
    name: "",
  });

  const { 
    values, 
    errors, 
    touched,
    handleReset, 
    handleChange, 
    handleBlur, 
    handleSubmit } 
    = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      let response;

      if (props.editData) {
        response = await props.updateComponentCategoriesAction(props.editData.id, values);
      } else {
        response = await props.postComponentCategoriesAction(values);
      }

      if (response.status === 201 || response.status === 200) {
        if (response.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
          props.getComponentCategoriesAction();
        } else {
          setInitialData({
            name: "",
          });
          props.getComponentCategoriesAction();
          toast.success(t("home:updateSuccess"));
        }
        props.setEditData(null);
      } else {
        Object.values(response.data)?.map((item: any) => {
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row rate_form align-items-center">
        <div className="col-md-12">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("maintainance:title")} :
            </label>

            <textarea
              className="form-control"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="name" errors={errors} touched={touched} />
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
            className="btn custom-btn-outlined mr-2"
            text={t("home:cancel")}
            type="reset"
            onClick={() => {
              const resetKeys: any = Object.keys(initialData).reduce((acc, curr) => {
                acc[curr] = '';
                return acc;
              }, {});
              setInitialData(resetKeys)
              props.setEditData(null);
              // handleReset({
              //   initialData
              // })
            }}
          />
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  postLoading: state.componentCategories.postComponentCategories.isFetching,
  updateLoading: state.componentCategories.updateComponentCategories.isFetching,
});

const mapDispatchToProps = {
  postComponentCategoriesAction: postComponentCategoriesAction,
  updateComponentCategoriesAction: updateComponentCategoriesAction,
  getComponentCategoriesAction: getComponentCategoriesAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CategoriesForm);
