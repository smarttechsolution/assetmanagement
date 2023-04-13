import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getTestParametersAction } from "store/modules/testParamters/getTestParameters";
import { postTestParametersAction } from "store/modules/testParamters/postTestParameters";
import { updateTestParametersAction } from "store/modules/testParamters/updateTestParameters";
import { RootState } from "store/root-reducer";
import { testParametersInitialValues, testParametersValidationSchema } from "./schema";
import { useTranslation } from "react-i18next";
import { PARAMETER_TYPES_OPTIONS } from "constants/constants";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import TooltipLabel from "components/UI/TooltipLabel";

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any;
}

const Form = (props: Props) => {
  const { t } = useTranslation();

  const [initialData, seetInitialData] = React.useState<typeof testParametersInitialValues>(
    testParametersInitialValues
  );

  React.useEffect(() => {
    if (props.editData) {
      seetInitialData({
        ...props.editData,
        types: PARAMETER_TYPES_OPTIONS.find((item) => item.value === props.editData.types) || null,
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
    validationSchema: testParametersValidationSchema,
    onSubmit: async (submitValue, { resetForm }) => {
      let res;
      if (props.editData) {
        res = await props.updateTestParametersAction(props.editData.id, {
          ...submitValue,
          types: submitValue.types?.value,
        });
      } else {
        res = await props.postTestParametersAction({
          ...submitValue,
          types: submitValue.types?.value,
        });
      }
      if (res.status === 201 || res.status === 200) {
        if (res.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          props.setEditData(null);
          seetInitialData(testParametersInitialValues);
          toast.success(t("home:updateSuccess"));
        }
        props.getTestParametersAction();
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
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:param")} {t("home:name")}:
            </label>

            <input
              className="form-control"
              name="parameter_name"
              value={values.parameter_name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="parameter_name" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:unit")}:
            </label>

            <input
              className="form-control"
              name="unit"
              value={values.unit}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="unit" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:ndwq")} <TooltipLabel id={"NDWQ"} text={t("home:ndwstandard")} />:
            </label>

            <input
              className="form-control"
              name="NDWQS_standard"
              value={values.NDWQS_standard}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="NDWQS_standard" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:types")}:
            </label>

            <StyledSelect
              name="types"
              value={values?.types}
              options={PARAMETER_TYPES_OPTIONS}
              onChange={({ name, value }) => {
                setFieldValue(name, value);
              }}
              onBlur={() => {
                setFieldTouched("types", true);
              }}
            />
            <FormikValidationError name="types" errors={errors} touched={touched} />
          </div>
        </div>

        <div className="col-md-12 text-right">
          <Button
            className="btn custom-btn  mr-2"
            text={t("home:save")}
            disabled={props.loading}
            loading={props.loading}
          />
          <Button 
            className="btn custom-btn-outlined"
            text={t("home:cancel")}
            type="reset"
            onClick={() => {
              const resetKeys: any = Object.keys(initialData).reduce((acc, curr) => {
                acc[curr] = '';
                return acc;
              }, {});
              seetInitialData(resetKeys)
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
});

const mapDispatchToProps = {
  getTestParametersAction,
  updateTestParametersAction,
  postTestParametersAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Form);
