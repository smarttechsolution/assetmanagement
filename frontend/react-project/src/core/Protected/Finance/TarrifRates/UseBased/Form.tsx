import { DeleteIcon } from "assets/images/xd";
import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError, {
  FormikFieldArrayValidationError,
} from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import TooltipLabel from "components/UI/TooltipLabel";
import { FieldArray, Form, Formik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getUsIncomeEstimateThisYearAction } from "store/modules/waterTarrifs/getIncomeEstimateThisYear";
import { getUseBasedWaterTarrifsAction } from "store/modules/waterTarrifs/getUseBasedWaterTarrifs";
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
      unit_from: Yup.number().required("This field accept only number"),
      unit_to: Yup.number().required("This field accept only number"),
      rate: Yup.string().required("This field is required"),
      estimated_paying_connection: Yup.string().required("This field is required"),
    })
  ),
});

const UseBasedForm = (props: Props) => {
  const { t } = useTranslation();
  const { editData } = props;

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

  const [startFrom, setStartFrom] = React.useState("");
  const [startTo, setStartTo] = React.useState("");


  // React.useEffect(() => {
  //   var from = new RegExp(/^\d*\.?\d*$/);
  //   if (unit_from === ".") {

  //   }
  // },[])

  const handleTariffSubmit = async (values, resetForm) => {
    let response;

    if (props.editData) {
      response = await props.updateUseBasedWaterTariffAction(
        props.language,
        props.editData?.id,
        { ...values, terif_type: "Use Based", tariff: props.editData?.tariff?.tariff },
        { tariff_type: "use" }
      );
    } else {
      response = await props.postUseBasedWaterTariffAction(props.language, {
        ...values,
        apply_date: formatDate(values.apply_date),
        terif_type: "Use Based",
      }, { tariff_type: "use" });
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
        props.setEditData(null);
        toast.success(t("home:updateSuccess"));
      }

      props.getUseBasedWaterTarrifsAction(props.language, props.schemeSlug);
      props.getUsIncomeEstimateThisYearAction(props.schemeSlug);
    } else {
      const errorList = response.data && response.data.error;
      if (errorList instanceof Array) {
        errorList.forEach((item) => {
          toast.error(item);
          console.log(item, "ITEMmmmmmmmmmmmmm");

        });
      }
      toast.error(response.data["used_based_units"][0]["unit_from"][0])
      toast.error(response.data["used_based_units"][0]["unit_to"][0])

    }
  };

  React.useEffect(() => {
    if (props.editData) {
      console.log(props.editData, "props.editData");
      setInitialData({
        apply_date: props.editData?.apply_date,
        used_based_units: props.editData?.used_based_units,
      });
    } else {
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
  }, [props.editData, props.scheme]);

  // const [startFrom, setStartFrom] = useState<any>("");
  // const [startTo, setStartTo] = useState<any>("");


  // const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;

  // const setFieldValue = (e) => {
  //   if (rx_live.test(e.target.value))
  //       setStartFrom({ startFrom : e.target.value });
  //       console.log(setStartFrom, "__________________--");

  // }




  // const [addUnit, setAddUnit] = React.useState<any>();

  // React.useEffect(() => {
  //   var arrayHelpers;
  //   let perUnits = <label htmlFor="" className="mr-1 pl-0 ">
  //     {t("home:rate")} {t("finance:permnth")} ({props.scheme?.currency}) :
  //     <TooltipLabel id={"rate"} text={t("finance:rateperunit")} />
  //   </label>
  //   let perMnth = <label htmlFor="" className="mr-1 pl-0 ">
  //     {t("home:rate")} {t("finance:permnth")} ({props.scheme?.currency}) :
  //     <TooltipLabel id={"rate"} text={t("finance:rateperunit")} />
  //   </label>
  //   if (arrayHelpers.push) {
  //     setAddUnit(perUnits)
  //   }
  //   else {
  //     setAddUnit(perMnth)
  //   }
  // })



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
            <div className="col-md-2 ">
              <div className="form-group top  mt-2">
                <label htmlFor="" className="mr-1 pl-0 ">
<<<<<<< HEAD
                  {t("home:applyDate")}{" "}
                  <TooltipLabel
                    id={"apd"}
                    text={`The date from which this record  should be applied to the system.`}
                  />
                  :
=======
                  {t("home:applyDate")}{" "} :
                  <TooltipLabel
                    id={"apd"}
                    text={t("home:appdate")}
                  />
>>>>>>> ams-final
                </label>
                <div style={{ width: "121%" }}>
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
                </div>
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
                                {t("finance:unit")} {t("finance:starting")} {t("finance:from")} :
                                <TooltipLabel id={"unstrt"} text={t("finance:unitstartfrom")} />
                              </label>

                              <input
                                type="number"
                                className="form-control"
                                pattern="[+-]?\d+(?:[.,]\d+)?"
                                name={`used_based_units[${index}][unit_from]`}
                                value={values.used_based_units[index]["unit_from"]}
                                onChange={(e) => {
                                  setFieldValue(e.target.name, e.target.value);
                                }
                                }
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
                          <div className="col-md-3">
                            <div className="form-group ">
                              <label htmlFor="" className="mr-1 pl-0 ">
                                {t("finance:unit")} {t("finance:upto")} {t("finance:and")} {t("finance:including")}:
                                <TooltipLabel id={"unitup"} text={t("finance:unitupto")} />
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
                              {index === 0 ? (
                                <label htmlFor="" className="mr-1 pl-0 ">
                                {t("home:rate")} {t("finance:permnth")} ({props.scheme?.currency}) :
                                <TooltipLabel id={"rate"} text={t("finance:rateperunit")} />
                              </label>
                              ):(
                                <label htmlFor="" className="mr-1 pl-0 ">
                                {t("home:rate")} {t("finance:perunit")} ({props.scheme?.currency}) :
                                <TooltipLabel id={"rate"} text={t("finance:rateperunit")} />
                              </label>
                              )}
                              {/* <label htmlFor="" className="mr-1 pl-0 ">
                                {t("home:rate")} {t("finance:permnth")} ({props.scheme?.currency}) :
                                <TooltipLabel id={"rate"} text={t("finance:rateperunit")} />
                              </label> */}
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
                          <div className="col-md-3">
                            <div className="form-group ">
                              <label htmlFor="" className="mr-1 pl-0 ">
                                {t("finance:epcs")}:
<<<<<<< HEAD
                                <TooltipLabel
                                  id={"epcs"}
                                  text={`Estimated Paying Connections`}
                                />
=======
                                <TooltipLabel id={"epcs"} text={t("finance:EPConnection")} />
>>>>>>> ams-final
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

                          <div className="col-1 text-right">
                            <img
                              src={DeleteIcon}
                              className="mt-2"
                              role="button"
                              onClick={() => arrayHelpers.remove(index)}
                            />
                          </div>
                        </div>
                        {index === values.used_based_units?.length - 1 && (
                          <div className="col-12 mt-3">
                            <div className="text-right">
                              <Button
                                className="btn custom-btn  mr-2"
                                text={t("finance:add")}
                                onClick={() => arrayHelpers.push("")}
                              />

                              <Button
                                className="btn custom-btn mr-2"
                                text={t("home:save")}
                                disabled={props.postLoading || props.updateLoading}
                                loading={props.postLoading || props.updateLoading}
                              />

                              <Button
                                className="btn custom-btn-outlined"
                                text={t("home:cancel")}
                                type='reset'
                                onClick={() => {
                                  // const resetKeys: any = Object.keys(initialData).reduce((acc, curr) => {
                                  //   acc[curr] = "";
                                  //   return acc;
                                  // }, {});

                                  //if we need resetKeys then remove initialData from below setInitialData() 
                                  setInitialData(initialData)
                                  props.setEditData(null);
                                }}
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
