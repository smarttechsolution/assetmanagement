import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import {
  IMPACT_OF_FAILURE_OPTIONS,
  MITIGATION_OPTIONS,
  POSSIBILITY_OF_FAILURE_OPTIONS,
  RESPONSIBLE_OPTIONS,
} from "constants/constants";
import { useFormik } from "formik";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { getComponentAction } from "store/modules/component/getComponent";
import { postComponentInfoAction } from "store/modules/componentInfo/postComponentInfo";
import { updateComponentInfoAction } from "store/modules/componentInfo/updateComponentInfo";
import { getIncomeCategoryAction } from "store/modules/income/getIncomeCategory";
import { getDashboardComponentInfoAction } from "store/modules/maintainance/dashboardComponentInfo";
import { getSupplyBeltsAction } from "store/modules/supplyBelts/getWaterSupplyBelts";
import { RootState } from "store/root-reducer";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import formatDate from "utils/utilsFunction/date-converter";
import TooltipLabel from "components/UI/TooltipLabel";
import CustomCheckBox from "components/UI/CustomCheckbox";

const initialFormValues = {
  possible_failure: "",
  component_numbers: "",
  description: "",
  maintenance_cost: 0,
  labour_cost: 0.0,
  material_cost: 0.0,
  replacement_cost: 0.0,
  maintenance_action: "",
  maintenance_interval: "",
  next_action: "",
  apply_date: "",
  componant_picture: null as any,
  component: null as OptionType | null,
  impact_of_failure: null as OptionType | null,
  possibility_of_failure: null as OptionType | null,
  mitigation: null as OptionType | null,
  responsible: "",
  interval_unit: "Year",
  is_cost_seggregated: false,
};

const validationScheme = Yup.object({
  component: Yup.mixed().required("This field is required"),
  possible_failure: Yup.string().required("This field is required"),
  component_numbers: Yup.string().required("This field is required"),
  maintenance_cost: Yup.number().required("This field is required"),
  labour_cost: Yup.string().nullable(),
  material_cost: Yup.string().nullable(),
  replacement_cost: Yup.string().nullable(),
  maintenance_action: Yup.string().required("This field is required"),
  maintenance_interval: Yup.string().required("This field is required"),
  impact_of_failure: Yup.mixed().required("This field is required"),
  possibility_of_failure: Yup.mixed().required("This field is required"),
  mitigation: Yup.mixed().required("This field is required"),
  responsible: Yup.string().required("This field is required"),
  // next_action: Yup.string().required("This field is required"),
  apply_date: Yup.string().required("This field is required"),
  interval_unit: Yup.string().required("This field is required"),
});

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any;
}

const ExpenseForm = (props: Props) => {
  const { t } = useTranslation();

  
  const [initialData, setInitialData] = React.useState(initialFormValues);
  const [categoryOption, setCategoryOptions] = React.useState<OptionType[]>();
  const [imagePreview, setImagePreview] = React.useState<any>("");
  const [ mitigate, setMitigate ] = React.useState();

  // React.useEffect(() => {
  //   // var reactive = "Reactive";
  //   if (MITIGATION_OPTIONS === "Reactive") {
      
  //   } else {
      
  //   }
  // },[])

  React.useEffect(() => {
    if (props.schemeSlug) {
      getIncomeCategoryAction(props.schemeSlug);
      props.getComponentAction();
    }
  }, [props.schemeSlug]);

  React.useEffect(() => {
    if (props.components) {
      const options = props.components?.map((item) => ({
        label: "" + item.name,
        value: "" + item.id,
      }));
      setCategoryOptions(options);
    }
  }, [props.components]);

  React.useEffect(() => {
    if (props.editData) {
      setInitialData({
        ...props.editData,
        component: { label: props.editData?.component?.name, value: props.editData?.component?.id },
        possibility_of_failure: POSSIBILITY_OF_FAILURE_OPTIONS.find(
          (item) => item.value === props.editData?.possibility_of_failure
        ),
        impact_of_failure: IMPACT_OF_FAILURE_OPTIONS.find(
          (item) => item.value === props.editData?.impact_of_failure
        ),
        mitigation: MITIGATION_OPTIONS.find((item) => item.value === props.editData?.mitigation),
        responsible: props.editData?.responsible,
        apply_date: props.editData.apply_date || "",
      });

      if (props.editData?.componant_picture) {
        setImagePreview(props.editData?.componant_picture);
      }
    } else {
      setInitialData({
        ...initialFormValues,
        apply_date: props.scheme?.tool_start_date,
      });
    }
  }, [props.editData, props.scheme, props.yearIntervals]);

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
      let requestData = {
        ...submitValue,
        component: submitValue?.component?.value,
        impact_of_failure: submitValue?.impact_of_failure?.value,
        possibility_of_failure: submitValue?.possibility_of_failure?.value,
        mitigation: submitValue?.mitigation?.value,
        responsible: submitValue?.responsible,
        maintenance_cost: +values.maintenance_cost,
        labour_cost: +values.labour_cost,
        material_cost: +values.material_cost,
        replacement_cost: +values.replacement_cost,
      };

      if (values.componant_picture && values.componant_picture instanceof File) {
        requestData.componant_picture = values.componant_picture;
      } else {
        delete requestData.componant_picture;
      }

      let res;
      if (props.editData) {
        res = await props.updateComponentInfoAction(props.language, props.editData.id, requestData);
      } else {
        res = await props.postComponentInfoAction(props.language, requestData);
      }


      if (res.status === 201 || res.status === 200) {
        if (res.status === 201) {
          toast.success(t("home:postSuccess"));
        } else {
          toast.success(t("home:updateSuccess"));
        }
        setInitialData(initialFormValues);
        props.toggle(false);
        props.setEditData(null);
        props.getDashboardComponentInfoAction(props.language, props.schemeSlug);
      } 
      // else {
      //   toast.error("Server Error");
      // }
       else {
        const errors = Object.values(res.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }
    },
  });

  const handleImagePreview = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setImagePreview(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  // const handleMaintenanceIntervalChange = (value, unit) => {
  //   if (unit === "Year") {
  //     const nextActionDate =
  //       props.yearIntervals?.find((date) => String(value).split(".")[0] === String(date.year_num))
  //         ?.start_date || "";
  //     setFieldValue("next_action", nextActionDate);
  //   }
  // };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row align-items-center">
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("maintainance:compone")} {t("home:name")} :
            </label>

            <StyledSelect
              name="component"
              value={values.component}
              options={categoryOption}
              onChange={({ name, value }) => {
                setFieldValue(name, value);
              }}
              onBlur={() => {
                setFieldTouched("component", true);
              }}
            />

            <FormikValidationError name="component" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("maintainance:nofcomponents")}{" "}
              <TooltipLabel id={"nocints"} text={t("home:noc")} />
            </label>

            <input
              className="form-control"
              name="component_numbers"
              value={values.component_numbers}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="component_numbers" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:possibleFailure")}:
            </label>

            <input
              className="form-control"
              name="possible_failure"
              value={values.possible_failure}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="possible_failure" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:maintainanceAction")}:
            </label>

            <input
              className="form-control"
              name="maintenance_action"
              value={values.maintenance_action}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="maintenance_action" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:maintainanceInterval")}:
            </label>

            <div className="input-group component-info">
              <input
                type="number"
                id="border-right"
                className="form-control "
                name="maintenance_interval"
                value={values.maintenance_interval}
                onChange={(e) => {
                  handleChange(e);
                  // handleMaintenanceIntervalChange(e.target.value, values?.interval_unit); comment ho
                }}
                onBlur={handleBlur}
                step="0.1"
              />
              <select
                id="border-left"
                className="form-control"
                name="interval_unit"
                value={values.interval_unit}
                onChange={(e) => {
                  handleChange(e);
                  // if (e.target.value !== "Year")
                  //   setFieldValue("next_action", props.scheme?.tool_start_date);
                }}
                onBlur={handleBlur}
              >
                <option value="Year">Year</option>
                <option value="Month">Month</option>
                <option value="Day">Day</option>
              </select>
            </div>

            <FormikValidationError name="maintenance_interval" errors={errors} touched={touched} />
          </div>
        </div>

        <div className="col-lg-12">
          <div className="form-group d-flex">
            <CustomCheckBox
              id={"is_cost_seggregated"}
              label={t("finance:icCostSegregated")}
              checked={values.is_cost_seggregated}
              onChange={(e) => setFieldValue("is_cost_seggregated", e.target.checked)}
            />
            <TooltipLabel id="cost_seperately" text={t("finance:costseperate")}/>

            <FormikValidationError name="is_cost_seggregated" errors={errors} touched={touched} />
          </div>
        </div>
        {!values.is_cost_seggregated && (
          <div className="col-lg-4">
            <div className="form-group ">
              <label htmlFor="" className="mr-1">
              {t("home:compexpected")} {t("home:maintenance")} {t("home:cost")} ({props.scheme?.currency}):
              </label>

              <input
                type="number"
                className="form-control"
                name="maintenance_cost"
                value={values.maintenance_cost}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormikValidationError name="maintenance_cost" errors={errors} touched={touched} />
            </div>
          </div>
        )}

        {values.is_cost_seggregated && (
          <>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("finance:LabourCost")} ({props.scheme?.currency}): <TooltipLabel id="lc" text={t("finance:LC")} />
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="labour_cost"
                  value={values.labour_cost}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="labour_cost" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("finance:MaterialCost")} ({props.scheme?.currency}): <TooltipLabel id="cc" text={t("finance:CC")} />
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="material_cost"
                  value={values.material_cost}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="material_cost" errors={errors} touched={touched} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group ">
                <label htmlFor="" className="mr-1">
                  {t("finance:ReplacementCost")} ({props.scheme?.currency}): <TooltipLabel id="rc" text={t("finance:RC")} />
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="replacement_cost"
                  value={values.replacement_cost}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormikValidationError name="replacement_cost" errors={errors} touched={touched} />
              </div>
            </div>
          </>
        )}

        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:pof")} :
            </label>

            <StyledSelect
              name="possibility_of_failure"
              value={values.possibility_of_failure}
              options={POSSIBILITY_OF_FAILURE_OPTIONS}
              onChange={({ name, value }) => {
                setFieldValue(name, value);
              }}
              onBlur={() => {
                setFieldTouched("possibility_of_failure", true);
              }}
            />

            <FormikValidationError
              name="possibility_of_failure"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:iof")}:
            </label>

            <StyledSelect
              name="impact_of_failure"
              value={values.impact_of_failure}
              options={IMPACT_OF_FAILURE_OPTIONS}
              onChange={({ name, value }) => {
                setFieldValue(name, value);
              }}
              onBlur={() => {
                setFieldTouched("impact_of_failure", true);
              }}
            />

            <FormikValidationError name="impact_of_failure" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:mitigation")}:
              <TooltipLabel id="miti" text={t("finance:miti")}/>
            </label>

            <StyledSelect
              name="mitigation"
              value={values.mitigation}
              options={MITIGATION_OPTIONS}
              onChange={({ name, value }) => {
                setFieldValue(name, value);
              }}
              onBlur={() => {
                setFieldTouched("mitigation", true);
              }}
            />

            <FormikValidationError name="mitigation" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:person")}:
            </label>

            <input
              type="text"
              className="form-control"
              name="responsible"
              value={values.responsible}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormikValidationError name="responsible" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:applyDate")}{" "}
              <TooltipLabel
                id={"apd"}
                text={t("home:appdate")}
              />
              :
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
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:nextActionDate")}{" "}
              <TooltipLabel
                id={"mada"}
                text={t("home:nad")}
              />
              :
            </label>

            {props.scheme?.system_date_format === "nep" ? (
              <>
                <NepaliDatePicker
                  value={values.next_action}
                  name="next_action"
                  onChange={(e) => {
                    setFieldValue("next_action", e);
                  }}
                />
              </>
            ) : (
              <>
                <EnglishDatePicker
                  name="next_action"
                  value={values.next_action}
                  handleChange={(e) => {
                    setFieldValue("next_action", formatDate(e));
                  }}
                />
              </>
            )}
            <FormikValidationError name="next_action" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:componentPicture")}:
            </label>

            <input
              type="file"
              multiple
              accept="image/png, image/jpeg"
              className="form-control"
              name="componant_picture"
              onChange={(e) => {
                if (e.target.files) {
                  setFieldValue(e.target.name, e.target.files[0]);
                  handleImagePreview(e.target.files[0]);
                }
              }}
              onBlur={handleBlur}
            />
            <FormikValidationError name="next_action" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          {imagePreview && (
            <div className="form-group ">
              <div className="align-vertical justify-content-end">
                <img src={imagePreview} alt="" width={150} height={100} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="col-md-12 text-right">
        <Button
          className="btn custom-btn  mr-3"
          text={t("home:save")}
          type="submit"
          loading={props.postLoading || props.updateLoading}
          disabled={props.postLoading || props.updateLoading}
        // disabled={authorizing}
        // loading={authorizing}
        />
        <Button
          className="btn custom-btn-outlined  mr-3"
          text={t("home:cancel")}
          type="button"
          onClick={() => props.toggle()}
        />
      </div>
    </form>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  components: state.component.getComponent.data,
  supplyBelts: state.supplyBeltsData.getSupplyBeltData.data,
  postLoading: state.componentInfo.postComponentInfo.isFetching,
  updateLoading: state.componentInfo.updateComponentInfo.isFetching,
  yearIntervals: state.waterSchemeData.getYearIntervals.data,
});

const mapDispatchToProps = {
  getComponentAction,
  getSupplyBeltsAction,
  postComponentInfoAction,
  updateComponentInfoAction,
  getDashboardComponentInfoAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ExpenseForm);
