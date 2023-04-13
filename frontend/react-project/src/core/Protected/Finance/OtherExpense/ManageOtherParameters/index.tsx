import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getInflationParametersAction } from "store/modules/inflationParameters/getInflationParameters";
import { postInflationParametersAction } from "store/modules/inflationParameters/postInflationParameters";
import { updateInflationparametersAction } from "store/modules/inflationParameters/updateInflationParameters";
import { RootState } from "store/root-reducer";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import TooltipLabel from "components/UI/TooltipLabel";

const validationSchema = Yup.object({
  rate: Yup.string().required("This field is required"),
  dis_allow_edit: Yup.mixed().nullable().required("This field is required"),
});

interface Props extends PropsFromRedux {}

const ManageOtherParamaters = (props: Props) => {
  const { t } = useTranslation();
  const [initialData, setInitialData] = React.useState({
    rate: 0,
    dis_allow_edit: null as null | OptionType,
  });

  React.useEffect(() => {
    if (props.language) {
      props.getInflationParametersAction(props.language);
    }
  }, [props.language]);

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
      const requestData = {
        ...values,
        dis_allow_edit: values?.dis_allow_edit?.value,
      };

      if (
        props.inflationParametersList instanceof Array &&
        props.inflationParametersList?.length > 0
      ) {
        const editData = props.inflationParametersList[0];
        response = await props.updateInflationparametersAction(
          props.language,
          editData.id,
          requestData
        );
      } else {
        response = await props.postInflationParametersAction(props.language, requestData);
      }

      if (response.status === 201 || response.status === 200) {
        if (response.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          setInitialData({
            rate: 0,
            dis_allow_edit: null,
          });
          toast.success(t("home:updateSuccess"));
        }
        props.getInflationParametersAction(props.language);
      }
    },
  });

  React.useEffect(() => {
    if (
      props.inflationParametersList instanceof Array &&
      props.inflationParametersList?.length > 0
    ) {
      const editData = props.inflationParametersList[0];
      setInitialData({
        ...editData,
        dis_allow_edit: editData?.dis_allow_edit
          ? { label: "Yes", value: true }
          : { label: "No", value: false },
      });
    }
  }, [props.inflationParametersList]);

  console.log(props.inflationParametersList, "inflationParametersList");

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
              {t("finance:inflation")} :
            </label>

            <input
              className="form-control"
              name="rate"
              value={values.rate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="rate" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="" className="mr-1">
              {t("finance:daeams")} 
              <TooltipLabel id={"twatm1"} text={t("home:allowCheckbook")} />:
            </label>

            <StyledSelect
              name="dis_allow_edit"
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              value={values.dis_allow_edit}
              onChange={({ name, value }) => {
                setFieldValue(name, value);
              }}
              onBlur={() => {
                setFieldTouched("dis_allow_edit", true);
              }}
            />
            <FormikValidationError name="dis_allow_edit" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-12 mt-2 text-right">
          <Button
            className="btn custom-btn"
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
  postLoading: state.inflationParametersData.postInflationParameters.isFetching,
  updateLoading: state.inflationParametersData.postInflationParameters.isFetching,
  inflationParametersList: state.inflationParametersData.getInflationParameters.data,
});

const mapDispatchToProps = {
  postInflationParametersAction: postInflationParametersAction,
  updateInflationparametersAction: updateInflationparametersAction,
  getInflationParametersAction: getInflationParametersAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ManageOtherParamaters);
