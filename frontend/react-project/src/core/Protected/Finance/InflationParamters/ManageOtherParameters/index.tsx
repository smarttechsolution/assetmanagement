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
});

interface Props extends PropsFromRedux {}

const ManageOtherParamaters = (props: Props) => {
  const { t } = useTranslation();
  const [initialData, setInitialData] = React.useState({
    rate: 0,
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
    handleReset,
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
          });
          toast.success(t("home:updateSuccess"));
        }

        props.getInflationParametersAction(props.language);
      }
      if (response.status === 400){
        const errors = Object.values(response.data)?.map((item: any) => {
          toast.error(item[0]);
        });
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
              {t("finance:yearly")} {t("finance:inflation")} 
                <TooltipLabel id={"apd"} text={t("home:inflrate")} />
               :
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
        
        <div className="col-md-12 mt-2 text-right">
          <Button
            className="btn custom-btn mr-2"
            text={t("home:save")}
            type="submit"
            disabled={props.postLoading || props.updateLoading}
            loading={props.postLoading || props.updateLoading}
          />
          {/* <Button
            className="btn custom-btn-outlined mr-3"
            text={t("home:cancel")}
            type="reset"
            onClick={() => {
              handleReset({
                initialData
              })
            }}
          /> */}
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
