import { DeleteIcon } from "assets/images/xd";
import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError, {
  FormikFieldArrayValidationError,
} from "components/React/FormikValidationError/FormikValidationError";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { PARAMETER_TYPES_OPTIONS } from "constants/constants";
import { FieldArray, Form as FormikForm, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getTestParametersAction } from "store/modules/testParamters/getTestParameters";
import { getWaterSupplyTestAction } from "store/modules/waterSupplyTest/getWaterSupplyTest";
<<<<<<< HEAD
import { postWaterSupplyTestAction } from "store/modules/waterSupplyTest/postWaterSupplyTest";
=======
// import { postWaterSupplyTestAction } from "store/modules/waterSupplyTest/postWaterSupplyTest";
import { postWaterTestResultAction } from "store/modules/waterSupplyTest/postWaterTestResults";
>>>>>>> ams-final
import { updateWaterSupplyTestAction } from "store/modules/waterSupplyTest/updateWaterSupplyTest";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
import { waterTestInitialValues, waterTestValidationSchema } from "./schema";
<<<<<<< HEAD
=======
import CustomCheckBox from "components/UI/CustomCheckbox";
import TooltipLabel from "components/UI/TooltipLabel";
>>>>>>> ams-final

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any;
}

const Form = (props: Props) => {
  const { t } = useTranslation();
<<<<<<< HEAD
=======
  const [ dateRange, setDateRange ] = React.useState(false);
>>>>>>> ams-final

  const [initialData, setInitialData] =
    React.useState<typeof waterTestInitialValues>(waterTestInitialValues);

  React.useEffect(() => {
    if (props.editData) {
<<<<<<< HEAD
      console.log(props.editData, ":editData")
      setInitialData({
        date: props.editData?.date,
=======

      console.log(props.editData, ":editData")

      setInitialData({
        date_from: props.editData?.date_from,
        date_to: props.editData?.date_to,
>>>>>>> ams-final
        test_result_parameter: props.editData?.test_result_parameter?.map((item) => ({
          parameter: item.parameter,
          parameter_name: item.name,
          value: item.value,
<<<<<<< HEAD
=======
          
>>>>>>> ams-final
        })),
      });
    } else if (props.testParamsData) {
      const initialValues = {
<<<<<<< HEAD
        date: "",
        test_result_parameter: props.testParamsData.map((item) => ({
          parameter: item.id,
          parameter_name: item.parameter_name,
          value: "",
=======
        date_from: "",
        date_to: "",
        test_result_parameter: props.testParamsData.map((item) => ({
          parameter: item.id,
          parameter_name: item.parameter_name,
          value: null as any,
>>>>>>> ams-final
        })),
      };
      setInitialData(initialValues);
    }
  }, [props.editData, props.testParamsData]);

  React.useEffect(() => {
    props.getTestParametersAction();
  }, []);

  const handleFormSubmit = async (submitValue, resetForm) => {
    console.log(submitValue, "submitValue");
    let res;
    if (props.editData) {
      res = await props.updateWaterSupplyTestAction(props.language, props.editData.id, {
        ...submitValue,
<<<<<<< HEAD
=======
        date: submitValue.date_from,
>>>>>>> ams-final
        test_result_parameter: submitValue?.test_result_parameter?.map((item) => ({
          value: item?.value,
          parameter: item?.parameter,
        })),
      });
    } else {
<<<<<<< HEAD
      res = await props.postWaterSupplyTestAction(props.language, {
=======
      res = await props.postWaterTestResultAction(props.language, {
>>>>>>> ams-final
        ...submitValue,
        test_result_parameter: submitValue?.test_result_parameter?.map((item) => ({
          value: item?.value,
          parameter: item?.parameter,
        })),
      });
    }
<<<<<<< HEAD
=======
    
    
>>>>>>> ams-final
    if (res.status === 201 || res.status === 200) {
      if (res.status === 201) {
        resetForm();
        toast.success(t("home:postSuccess"));
      } else {
<<<<<<< HEAD
        props.setEditData(null);
        setInitialData(waterTestInitialValues);
        toast.success(t("home:updateSuccess"));
=======
        props.setEditData({});
        setInitialData(waterTestInitialValues);
        toast.success(t("home:updateSuccess"));
        resetForm();
>>>>>>> ams-final
      }
      props.getWaterSupplyTestAction(props.language);
    } else {
      const errors = Object.values(res.data)?.map((item: any) => {
        toast.error(item[0]);
      });
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialData}
      validationSchema={waterTestValidationSchema}
      onSubmit={(values, { resetForm }) => {
        handleFormSubmit(values, resetForm);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldTouched,
        setFieldValue,
      }) => (
        <FormikForm>
          <div className="row align-items-center">
            <div className="col-md-3">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
<<<<<<< HEAD
                  {t("home:date")} :
=======
                  {t("home:supplyDate")} :
>>>>>>> ams-final
                </label>

                {props.schemeDetails?.system_date_format === "nep" ? (
                  <NepaliDatePicker
                    className="form-control"
<<<<<<< HEAD
                    name="date"
                    value={values.date}
                    onChange={(e) => {
                      setFieldValue("date", e);
=======
                    name="date_from"
                    value={values.date_from}
                    onChange={(e) => {
                      setFieldValue("date_from", e);
>>>>>>> ams-final
                    }}
                  />
                ) : (
                  <EnglishDatePicker
<<<<<<< HEAD
                    name="date"
                    value={values.date}
                    handleChange={(e) => {
                      setFieldValue("date", formatDate(e));
                    }}
                  />
                )}
                <FormikValidationError name="date" errors={errors} touched={touched} />
              </div>
            </div>

=======
                    name="date_from"
                    value={values.date_from}
                    handleChange={(e) => {
                      setFieldValue("date_from", formatDate(e));
                    }}
                  />
                )}
                <FormikValidationError name="date_from" errors={errors} touched={touched} />
              </div>
            </div>

            <div className="col-md-3">
              <div className="form-group mt-5 d-flex">
                <CustomCheckBox
                  id={"date_to"}
                  label={t("home:addaterange")}
                  // onChange={(e) => setFieldValue("atdaterange", e.target.checked)} 
                  onClick={(e) => setDateRange(!dateRange)}
                  />
              </div>
            </div>

            {dateRange && (
              <div className="col-lg-3">
                <div className="form-group ">
                  <label htmlFor="" className="mr-1">
                    {t("home:supplyendDate")} :
                  </label>

                  {props.schemeDetails?.system_date_format === "nep" ? (
                    <NepaliDatePicker
                      className="form-control"
                      name="date_to"
                      value={values.date_to}
                      onChange={(e) => {
                        setFieldValue("date_to", e);
                      }}
                    />
                  ) : (
                    <EnglishDatePicker
                      name="date_to"
                      value={values.date_to}
                      handleChange={(e) => {
                        setFieldValue("date_to", formatDate(e));
                      }}
                    />
                  )}
                  {/* <FormikValidationError name="date_to" errors={errors} touched={touched} /> */}
                </div>
              </div>
            )}





>>>>>>> ams-final
            <FieldArray
              name="test_result_parameter"
              render={(_) => (
                <>
                  {values.test_result_parameter?.map((item, index) => (
                    <div className="col-md-3" key={index}>
                      <div className="form-group ">
                        <label htmlFor="" className="mr-1">
                          {item.parameter_name} :
                        </label>

                        <input
                          className="form-control"
                          type="text"
                          name={`test_result_parameter[${index}][value]`}
                          value={values.test_result_parameter[index]["value"]}
                          onChange={(e) => {
                            setFieldValue(`test_result_parameter[${index}][value]`, e.target.value);
<<<<<<< HEAD
                          }} 
                        />
                        <FormikFieldArrayValidationError
=======
                          }}
                        />
                        {/* <FormikFieldArrayValidationError
>>>>>>> ams-final
                          keyName="test_result_parameter"
                          name="value"
                          index={index}
                          errors={errors}
                          touched={touched}
<<<<<<< HEAD
                        />
                      </div>
                    </div>
                  ))}
                  <div className="col-12 mt-3">
                    <div className="text-right">
                      <Button className="btn custom-btn " type="submit" text={t("home:save")} />
                    </div>
=======
                        /> */}
                      </div>
                    </div>
                  ))}
                  <div className="col-md-12 text-right">
                    <Button className="btn custom-btn mr-2"
                      type="submit"
                      text={t("home:save")}
                    />
                    {/* <Button
                      className="btn custom-btn-outlined"
                      text={t("home:cancel")}
                      type="reset"
                      onClick={() => {
                        const resetKeys: any = Object.keys(initialData).reduce((acc, curr) => {
                          acc[curr] = '';
                          return acc;
                        }, {});
                        setInitialData(resetKeys)
                      }}
                    /> */}
>>>>>>> ams-final
                  </div>
                </>
              )}
            />
          </div>{" "}
        </FormikForm>
      )}
    </Formik>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  loading:
    state.testParamtersData.postTestParameters.isFetching ||
    state.testParamtersData.updateTestParameters.isFetching,
  schemeDetails: state.waterSchemeData.waterSchemeDetailsData.data,
  testParamsData: state.testParamtersData.testParametersData.data,
});

const mapDispatchToProps = {
  getTestParametersAction,
  updateWaterSupplyTestAction: updateWaterSupplyTestAction,
<<<<<<< HEAD
  postWaterSupplyTestAction: postWaterSupplyTestAction,
=======
  postWaterTestResultAction: postWaterTestResultAction,
>>>>>>> ams-final
  getWaterSupplyTestAction: getWaterSupplyTestAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Form);
