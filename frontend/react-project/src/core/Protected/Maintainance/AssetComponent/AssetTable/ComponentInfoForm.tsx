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

const validationScheme = Yup.object({
  component: Yup.mixed().required("This field is required"),
  possible_failure: Yup.string().required("This field is required"),
  component_numbers: Yup.string().required("This field is required"),
  //   description: Yup.string().required("This field is required"),
  maintenance_cost: Yup.number().required("This field is required"),
  labour_cost: Yup.string().nullable(),
  material_cost: Yup.string().nullable(),
  replacement_cost: Yup.string().nullable(),
  maintenance_action: Yup.string().required("This field is required"),
  supply_belt: Yup.mixed(),
  maintenance_interval: Yup.string().required("This field is required"),
  impact_of_failure: Yup.mixed().required("This field is required"),
  possibility_of_failure: Yup.mixed().required("This field is required"),
  mitigation: Yup.mixed().required("This field is required"),
  responsible: Yup.mixed().required("This field is required"),
  next_action: Yup.string().required("This field is required"),
  apply_date: Yup.string().required("This field is required"),
});

interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any;
}

const ExpenseForm = (props: Props) => {
  const { t } = useTranslation();

  const [initialData, setInitialData] = React.useState({
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
    supply_belt: null as OptionType | null,
    impact_of_failure: null as OptionType | null,
    possibility_of_failure: null as OptionType | null,
    mitigation: null as OptionType | null,
    responsible: null as OptionType | null,
  });
  const [categoryOption, setCategoryOptions] = React.useState<OptionType[]>();
  const [supplyBeltOption, setSupplyBeltOptions] = React.useState<OptionType[]>();
  const [imagePreview, setImagePreview] = React.useState<any>("");

  React.useEffect(() => {
    if (props.schemeSlug) {
      getIncomeCategoryAction(props.schemeSlug);
      props.getComponentAction();
      props.getSupplyBeltsAction(props.language, props.schemeSlug);
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
    if (props.supplyBelts) {
      const options = props.supplyBelts?.map((item) => ({
        label: "" + item.name,
        value: "" + item.id,
      }));
      setSupplyBeltOptions(options);
    }
  }, [props.supplyBelts]);

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
        responsible: RESPONSIBLE_OPTIONS.find((item) => item.value === props.editData?.responsible),
        apply_date: props.editData.apply_date || "",
      });
    } else {
      setInitialData({
        possible_failure: "",
        component_numbers: "",
        description: "",
        maintenance_cost: 0,
        labour_cost: 0.0,
        material_cost: 0.0,
        replacement_cost: 0.0,
        maintenance_action: "",
        maintenance_interval: "",
        componant_picture: null as any,
        next_action:
          props.yearIntervals?.find((date) => date.is_present_year === true)?.start_date || "",
        apply_date: props.scheme?.tool_start_date || "",
        component: null as OptionType | null,
        supply_belt: null as OptionType | null,
        impact_of_failure: null as OptionType | null,
        possibility_of_failure: null as OptionType | null,
        mitigation: null as OptionType | null,
        responsible: null as OptionType | null,
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
        supply_belt: submitValue?.supply_belt?.value || "",
        impact_of_failure: submitValue?.impact_of_failure?.value,
        possibility_of_failure: submitValue?.possibility_of_failure?.value,
        mitigation: submitValue?.mitigation?.value,
        responsible: submitValue?.responsible?.value,
        maintenance_cost: +values.maintenance_cost,
        labour_cost: +values.labour_cost,
        material_cost: +values.material_cost,
        replacement_cost: +values.replacement_cost,
      };

      if (values.componant_picture instanceof File) {
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
        setInitialData({
          component: null as OptionType | null,
          possible_failure: "",
          component_numbers: "",
          description: "",
          maintenance_cost: 0.0,
          labour_cost: 0.0,
          material_cost: 0.0,
          replacement_cost: 0.0,
          maintenance_action: "",
          componant_picture: null as any,
          supply_belt: null as OptionType | null,
          maintenance_interval: "",
          impact_of_failure: null as OptionType | null,
          possibility_of_failure: null as OptionType | null,
          mitigation: null as OptionType | null,
          responsible: null as OptionType | null,
          next_action: "",
          apply_date: "",
        });
        props.toggle(false);
        props.setEditData(null);
        props.getDashboardComponentInfoAction(props.language, props.schemeSlug);
      } else {
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

  console.log(values, "resss");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row align-items-start">
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("maintainance:component")} {t("maintainance:category")}:
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
              {t("maintainance:component")} {t("finance:number")}:
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

            <input
              type="number"
              className="form-control"
              name="maintenance_interval"
              value={values.maintenance_interval}
              onChange={handleChange}
              onBlur={handleBlur}
              step="0.1"
            />
            <FormikValidationError name="maintenance_interval" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:MaintenanceCost")} ({props.scheme?.currency}.):
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
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:LabourCost")} ({props.scheme?.currency}.):
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
              {t("finance:MaterialCost")} ({props.scheme?.currency}.):
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
              {t("finance:ReplacementCost")} ({props.scheme?.currency}.):
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
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:supplyBelt")} :
            </label>

            <StyledSelect
              name="supply_belt"
              value={values.supply_belt}
              options={supplyBeltOption}
              onChange={({ name, value }) => {
                setFieldValue(name, value);
              }}
              onBlur={() => {
                setFieldTouched("supply_belt", true);
              }}
            />

            <FormikValidationError name="supply_belt" errors={errors} touched={touched} />
          </div>
        </div>
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

            <StyledSelect
              name="responsible"
              value={values.responsible}
              options={RESPONSIBLE_OPTIONS}
              onChange={({ name, value }) => {
                setFieldValue(name, value);
              }}
              onBlur={() => {
                setFieldTouched("responsible", true);
              }}
            />

            <FormikValidationError name="responsible" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:applyDate")}:
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
              {t("finance:nextActionDate")}:
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

          {imagePreview || props.editData?.componant_picture ? (
            <div className="form-group ">
              <div className="align-vertical justify-content-end">
                <img
                  src={imagePreview || props.editData?.componant_picture}
                  alt=""
                  width={150}
                  height={100}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="col-md-12 text-right">
        <Button
          className="btn custom-btn  mr-3"
          text={t("home:save")}
          type="submit"
          // disabled={authorizing}
          // loading={authorizing}
          disabled={props.postLoading || props.updateLoading}
          loading={props.postLoading || props.updateLoading}
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
