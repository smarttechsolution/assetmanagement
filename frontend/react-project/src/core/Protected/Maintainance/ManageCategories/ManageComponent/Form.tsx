import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import { Form, useFormik } from "formik";
import React from "react";
import Button from "components/UI/Forms/Buttons";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import toast from "components/React/ToastNotifier/ToastNotifier";
import * as Yup from "yup";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import { postComponentAction } from "store/modules/component/postComponent";
import { updateComponentAction } from "store/modules/component/updateComponent";
import { getComponentAction } from "store/modules/component/getComponent";

import { useTranslation } from "react-i18next";

const validationSchema = Yup.object({
  name: Yup.string().required("This field is required"),
  category: Yup.mixed().required("This field is required"),
});

interface Props extends PropsFromRedux {
  editData: any;
  setEditData: any;
}

const ComponentForm = (props: Props) => {
  const { t } = useTranslation();
  const [initialData, setInitialData] = React.useState({
    name: "",
    category: null as null | OptionType,
  });

  const [options, setOptions] = React.useState<OptionType[]>();

  React.useEffect(() => {
    if (props.componentCategories) {
      const newOpt = props.componentCategories.map((item) => ({
        label: "" + item.name,
        value: "" + item.id,
      }));
      setOptions(newOpt);
    }
  }, [props.componentCategories]);

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
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      let response;

      if (props.editData) {
        response = await props.updateComponentAction(props.editData.id, {
          ...values,
          category: values.category?.value,
        });
      } else {
        response = await props.postComponentAction({ ...values, category: values.category?.value });
      }

      if (response.status === 201 || response.status === 200) {
        if (response.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
          props.getComponentAction();
        } else {
          setInitialData({
            name: "",
            category: null,
          });
          props.getComponentAction();
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
        category: { label: props.editData?.category?.name, value: props.editData?.category?.id },
      });
    }
  }, [props.editData]);

  console.log(props.editData, "props.editData");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row rate_form align-items-center">
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="" className="mr-1">
              {t("maintainance:category")}:
            </label>

            <StyledSelect
              name="category"
              options={options}
              value={values.category}
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
        <div className="col-md-12">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:name")} :
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
            className="btn custom-btn mr-3"
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
  componentCategories: state.componentCategories.getComponentCategories.data,
  postLoading: state.component.postComponent.isFetching,
  updateLoading: state.component.updateComponent.isFetching,
});

const mapDispatchToProps = {
  postComponentAction: postComponentAction,
  updateComponentAction: updateComponentAction,
  getComponentAction: getComponentAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ComponentForm);
