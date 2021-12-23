import { DeleteIcon } from "assets/images/xd";
import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError, {
  FormikFieldArrayValidationError,
} from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import { FieldArray, Form, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getUsIncomeEstimateThisYearAction } from "store/modules/waterTarrifs/getIncomeEstimateThisYear";
import { getUseBasedWaterTarrifsAction } from "store/modules/waterTarrifs/getUseBasedWaterTarrifs";
import { getWaterTarrifsAction } from "store/modules/waterTarrifs/getWaterTarrifs";
import { postUseBasedWaterTariffAction } from "store/modules/waterTarrifs/postUseBasedWaterTariff";
import { updateUseBasedWaterTariffAction } from "store/modules/waterTarrifs/updateUseBasedWaterTariff";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
import * as Yup from "yup";

interface Props extends PropsFromRedux {
  editData;
  setEditData;
}

type useBasedType = {
  unit_from: any;
  unit_to: any;
  rate: any;
  estimated_paying_connection: any;
};

const validationSchema = Yup.object({
  apply_date: Yup.mixed().required("This field is required"),
  used_based_units: Yup.array().of(
    Yup.object().shape({
      unit_from: Yup.string().required("This field is required"),
      unit_to: Yup.string().required("This field is required"),
      rate: Yup.string().required("This field is required"),
      estimated_paying_connection: Yup.string().required("This field is required"),
    })
  ),
});

const UseBasedForm = (props: Props) => {
  const { t } = useTranslation();
  const { editData, postUseBasedWaterTariffAction } = props;

  console.log(editData, "editDataeditData");

  const [initialData, setInitialData] = React.useState({
    apply_date: "",
    used_based_units: [
      {
        unit_from: "",
        unit_to: "",
        rate: "",
        estimated_paying_connection: "",
      },
    ] as useBasedType[],
  });

  React.useEffect(() => {
    if (props.scheme) {
      setInitialData({
        apply_date: props.scheme?.tool_start_date || "",
        used_based_units: [
          {
            unit_from: "",
            unit_to: "",
            rate: "",
            estimated_paying_connection: "",
          },
        ],
      });
    }
  }, [props.scheme]);

  const handleTariffSubmit = async (values, resetForm) => {
    let response;

    if (props.editData) {
      const updateValues = {
        apply_date: values.apply_date,
        ...values.used_based_units[0],
        tariff: props.editData?.tariff?.tariff,
      };

      console.log(updateValues, "updateValues");
      response = await props.updateUseBasedWaterTariffAction(
        props.language,
        props.editData.tariff?.id,
        updateValues
      );
    } else {
      response = await props.postUseBasedWaterTariffAction(props.language, {
        ...values,
        apply_date: formatDate(values.apply_date),
      });
    }

    if (response && (response.status === 201 || response.status === 200)) {
      if (response.status === 201) {
        resetForm();
        toast.success(t("home:postSuccess"));
      } else {
        setInitialData({
          apply_date: "",
          used_based_units: [
            {
              unit_from: "",
              unit_to: "",
              rate: "",
              estimated_paying_connection: "",
            },
          ],
        });

        toast.success(t("home:updateSuccess"));
      }
      props.getUseBasedWaterTarrifsAction(props.language, props.schemeSlug);
      props.getUsIncomeEstimateThisYearAction(props.schemeSlug);
    } else {
      const errorList = response.data && response.data.error;
      if (errorList instanceof Array) {
        errorList.forEach((item) => {
          toast.error(item);
        });
      }
      console.log(response, "errrr");
    }
  };

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        apply_date: props.editData?.item?.apply_date,
        used_based_units: [
          {
            unit_from: props.editData?.tariff?.unit_from,
            unit_to: props.editData?.tariff?.unit_to,
            rate: props.editData?.tariff?.rate,
            estimated_paying_connection: props.editData?.tariff?.estimated_paying_connection,
          },
        ],
      });
    }
  }, [props.editData]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialData}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        handleTariffSubmit(values, resetForm);
      }}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form>
          <div className="row tarrif_form ">
            <div className="col-md-4 ">
              <div className="form-group top  mt-2">
                <label htmlFor="" className="mr-1 pl-0 ">
                  {t("home:applyDate")}
                </label>

                {props.scheme?.system_date_format === "nep" ? (
                  <>
                    <NepaliDatePicker
                      value={values.apply_date}
                      name="apply_date"
                      onChange={(e) => {
                        setFieldValue("apply_date", e);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <EnglishDatePicker
                      name="apply_date"
                      value={values.apply_date}
                      handleChange={(e) => {
                        setFieldValue("apply_date", formatDate(e));
                      }}
                    />
                  </>
                )}
                <FormikValidationError name="apply_date" errors={errors} touched={touched} />
              </div>
            </div>
            <FieldArray
              name="used_based_units"
              render={(arrayHelpers) => (
                <>
                  {values.used_based_units &&
                    values.used_based_units.map((data, index) => (
                      <div className="col-12">
                        <div className="row align-items-center">
                          <div className="col-md-2">
                            <div className="form-group ">
                              <label htmlFor="" className="mr-1 pl-0 ">
                                {t("home:units")}:
                              </label>

                              <input
                                type="number"
                                className="form-control"
                                name={`used_based_units[${index}][unit_from]`}
                                value={values.used_based_units[index]["unit_from"]}
                                onChange={(e) => {
                                  setFieldValue(e.target.name, e.target.value);
                                }}
                              />
                              <FormikFieldArrayValidationError
                                keyName="used_based_units"
                                name="unit_from"
                                index={index}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group ">
                              <label htmlFor="" className="mr-1 pl-0 ">
                                {t("finance:to")}:
                              </label>

                              <input
                                type="number"
                                className="form-control"
                                name={`used_based_units[${index}][unit_to]`}
                                value={values.used_based_units[index]["unit_to"]}
                                onChange={(e) => {
                                  setFieldValue(e.target.name, e.target.value);
                                }}
                              />
                              <FormikFieldArrayValidationError
                                keyName="used_based_units"
                                name="unit_to"
                                index={index}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group ">
                              <label htmlFor="" className="mr-1 pl-0 ">
                                {t("home:rate")} ({props.scheme?.currency}):
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name={`used_based_units[${index}][rate]`}
                                value={values.used_based_units[index]["rate"]}
                                onChange={(e) => {
                                  setFieldValue(e.target.name, e.target.value);
                                }}
                              />
                              <FormikFieldArrayValidationError
                                keyName="used_based_units"
                                name="rate"
                                index={index}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-group ">
                              <label htmlFor="" className="mr-1 pl-0 ">
                                {t("finance:epc")}:
                              </label>

                              <input
                                type="number"
                                className="form-control"
                                name={`used_based_units[${index}][estimated_paying_connection]`}
                                value={
                                  values.used_based_units[index]["estimated_paying_connection"]
                                }
                                onChange={(e) => {
                                  setFieldValue(e.target.name, e.target.value);
                                }}
                              />
                              <FormikFieldArrayValidationError
                                keyName="used_based_units"
                                name="estimated_paying_connection"
                                index={index}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          {!props.editData && (
                            <div className="col-1 text-right">
                              <img
                                src={DeleteIcon}
                                className="mb-3"
                                role="button"
                                onClick={() => arrayHelpers.remove(index)}
                              />
                            </div>
                          )}
                        </div>
                        {index === values.used_based_units?.length - 1 && (
                          <div className="col-12 mt-3">
                            <div className="text-right">
                              {!props.editData && (
                                <Button
                                  className="btn custom-btn  mr-3"
                                  text={t("finance:add")}
                                  onClick={() => arrayHelpers.push("")}
                                />
                              )}
                              <Button
                                className="btn custom-btn "
                                text={t("home:save")}
                                disabled={props.postLoading || props.updateLoading}
                                loading={props.postLoading || props.updateLoading}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </>
              )}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  supplySchedule: state.waterTarrifsData.waterTarrifData.data,
  postLoading: state.waterTarrifsData.postUseBasedWaterTariff.isFetching,
  updateLoading: state.waterTarrifsData.updateUseBasedWaterTariff.isFetching,
});

const mapDispatchToProps = {
  postUseBasedWaterTariffAction: postUseBasedWaterTariffAction,
  updateUseBasedWaterTariffAction: updateUseBasedWaterTariffAction,
  getUsIncomeEstimateThisYearAction: getUsIncomeEstimateThisYearAction,
  getUseBasedWaterTarrifsAction: getUseBasedWaterTarrifsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UseBasedForm);
