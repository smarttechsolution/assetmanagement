import NepaliDatePicker from "components/React/Datepicker/Datepicker";
import EnglishDatePicker from "components/React/EnglishDatepicker/EnglishDatepicker";
import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import toast from "components/React/ToastNotifier/ToastNotifier";
import CustomCheckBox from "components/UI/CustomCheckbox";
import Button from "components/UI/Forms/Buttons";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getComponentAction } from "store/modules/component/getComponent";
import { postComponentInfoAction } from "store/modules/componentInfo/postComponentInfo";
import { updateComponentInfoAction } from "store/modules/componentInfo/updateComponentInfo";
import { getComponentInfoAction } from "store/modules/componentInfo/getComponentInfo";
import { getComponentLogsAction } from "store/modules/componentLogs/getComponentLogs";
import { postComponentLogsAction } from "store/modules/componentLogs/postComponentLogs";
import { updateComponentLogsAction } from "store/modules/componentLogs/updateComponentLogs";
import { getDashboardComponentInfoAction } from "store/modules/maintainance/dashboardComponentInfo";
import { getSupplyBeltsAction } from "store/modules/supplyBelts/getWaterSupplyBelts";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
import * as Yup from "yup";
<<<<<<< HEAD
import { SRLWrapper } from "simple-react-lightbox";


const LOG_TYPE_OPTIONS = [
  {
    label: "Maintenance",
    value: "Maintenance",
  },
  {
    label: "Issue",
    value: "Issue",
  },
];

const validationSchema = Yup.object({
  component: Yup.mixed().nullable().required("This field is required"),
=======
import CustomRadio from "components/UI/CustomRadio";
import TooltipLabel from "components/UI/TooltipLabel";

// const LOG_TYPE_OPTIONS = [
//   {
//     label: "Maintenance",
//     value: "Maintenance",
//   },
//   {
//     label: "Issue",
//     value: "Issue",
//   },
// ];

const validationSchema = Yup.object({
  component1: Yup.mixed().nullable().required("This field is required"),
>>>>>>> ams-final
  log_type: Yup.mixed().nullable().required("This field is required"),
  maintenance_date: Yup.string().required("This field is required"),
  possible_failure: Yup.string().required("This field is required"),
  maintenance_action: Yup.string().required("This field is required"),
  duration: Yup.string().required("This field is required"),
  interval_unit: Yup.string().required("This field is required"),
  cost_total: Yup.string().required("This field is required"),
  labour_cost: Yup.string().required("This field is required"),
  material_cost: Yup.string().required("This field is required"),
  replacement_cost: Yup.string().required("This field is required"),
  remarks: Yup.string().nullable(),
  log_status: Yup.string().required("This field is required"),
});

interface Props extends PropsFromRedux {
  editData: any;
  setEditData: any;
  toggle: any;
<<<<<<< HEAD
=======
  logType: boolean;
>>>>>>> ams-final
}

const ComponentLists = (props: Props) => {
  const { t } = useTranslation();
<<<<<<< HEAD
  const [initialData, setInitialData] = React.useState({
    component: null as null | OptionType,
    log_type: null as null | OptionType,
=======
  const [imagePreview, setImagePreview] = React.useState<any>([]);
  const [categoryOption, setCategoryOptions] = React.useState<OptionType[]>();
  const [initialData, setInitialData] = React.useState({
    component1: null as OptionType | null ,
    log_type: props.logType ? 'Issue' : 'Maintenance',
    componant_picture: "",
>>>>>>> ams-final
    maintenance_date: "",
    possible_failure: "",
    maintenance_action: "",
    duration: "",
    interval_unit: "Year",
    cost_total: 0,
    labour_cost: 0,
    material_cost: 0,
    replacement_cost: 0,
    remarks: "",
    is_cost_seggregated: false,
<<<<<<< HEAD
=======
    log_status: true,
>>>>>>> ams-final
  });
  

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
<<<<<<< HEAD
        component: values.component?.value,
        cost_total: values?.is_cost_seggregated
          ? Number(values?.material_cost) +
            Number(values?.replacement_cost) +
            Number(values?.labour_cost)
          : values?.cost_total,
      };

=======
        component1: values.component1?.value,
        cost_total: values?.is_cost_seggregated
          ? Number(values?.material_cost) +
          Number(values?.replacement_cost) +
          Number(values?.labour_cost)
          : values?.cost_total,
      };

      console.log(requestData, "requestDatarequestData")

      /* ADDED BY ME */ 

      // if (props.editData) {
      //   response = await props.updateComponentInfoAction(props.language, props.editData.id, requestData);
      // } else {
      //   response = await props.postComponentInfoAction(props.language, requestData);
      // }

      /* END */ 

>>>>>>> ams-final
      if (props.editData) {
        response = await props.updateComponentLogsAction(
          props.language,
          props.editData.id,
          requestData
        );
      } else {
        console.log({ requestData })
        response = await props.postComponentLogsAction(props.language, requestData);
        
      }

      if (response.status === 201 || response.status === 200) {
        if (response.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          setInitialData({
<<<<<<< HEAD
            component: null as null | OptionType,
            log_type: null as null | OptionType,
=======
            component1: null as null | OptionType,
            log_type: props.logType ? 'Issue' : 'Maintenance',
            componant_picture: "",
>>>>>>> ams-final
            maintenance_date: "",
            possible_failure: "",
            maintenance_action: "",
            duration: "",
            interval_unit: "",
            cost_total: 0,
            labour_cost: 0,
            material_cost: 0,
            replacement_cost: 0,
            remarks: "",
            is_cost_seggregated: false,
<<<<<<< HEAD
=======
            log_status: true,
>>>>>>> ams-final
          });
          toast.success(t("home:updateSuccess"));
        }
        props.setEditData(null);
        props.toggle();
        props.getComponentLogsAction(props.language);
        
      }
      else if (response.status === 400){
        const errors = Object.values(response.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }

    },
  });
  
  // ADDED BY ME
  React.useEffect(() => {
    if (props.components) {
      const options = props.components?.map((item) => ({
        label: "" + item?.name,
        value: "" + item?.id,
      }));
      setCategoryOptions(options);      
    }
  }, [props.components]);

  React.useEffect(() => {
    if (props.scheme) {
      props.getDashboardComponentInfoAction(props.language, props.scheme?.slug);
<<<<<<< HEAD
=======
      props.getComponentAction(); /*ADDED BY ME */
>>>>>>> ams-final
    }
  }, [props.scheme]);

  // React.useEffect(() => {
  //   if (props.editData) {
  //     props.getComponentLogsAction(props.language)
  //   }
  // },[props.editData])

  React.useEffect(() => {
    if (props.editData) {
      const editData = {
        ...props.editData,
        cost_total: props.editData?.cost_total || 0,
        labour_cost: props.editData?.labour_cost || 0,
        material_cost: props.editData?.material_cost || 0,
        replacement_cost: props.editData?.replacement_cost || 0,
<<<<<<< HEAD
        component: { value: props.editData.component, label: props.editData.component_name },
=======
        maintenance_date: props.editData?.maintenance_date || "",
        interval_unit: props.editData.interval_unit || "",
        component1: { value: props.editData.component1, label: props.editData.component_name },
>>>>>>> ams-final
      };
      delete editData.componant_picture;
      delete editData.supply_belt;
      setInitialData(editData);

      if (props.editData?.component_image) {
        setImagePreview([props.editData?.component_image]
        )
      }
    }
  }, [props.editData, props.yearIntervals]);

<<<<<<< HEAD
=======
  const handleImagePreview = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setImagePreview(old => [...old, reader.result]);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const handleMaintenanceIntervalChange = (value, unit) => {
    if (unit === "Year") {
      const nextActionDate =
        props.yearIntervals?.find((date) => String(value).split(".")[0] === String(date.year_num))
          ?.start_date || "";
      setFieldValue("next_action", nextActionDate);
    }
  };

>>>>>>> ams-final
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row rate_form align-items-center">
      <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="" className="mr-1 ">
              {t("maintainance:logType")}
            </label>

            <input
              className="form-control"
              value={props.logType ? 'Issue' : 'Maintenance'} disabled
            />
            {/* <StyledSelect
              name="log_type"
              options={LOG_TYPE_OPTIONS.filter(opt => (props.logType?"Issue":"Maintenance") == opt.value)}
              value={LOG_TYPE_OPTIONS?.find((opt: any) => opt.value === (values?.log_type || (props.logType?"Issue":"Maintenance")) ||null )}
              onChange={({ name, value }) => {
                setFieldValue(name, value && value["value"]);
              }}
              onBlur={() => {
                setFieldTouched("log_type", false);
              }}
            /> */}
            <FormikValidationError name="log_type" errors={errors} touched={touched} />
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="" className="mr-1 ">
              {t("maintainance:component")}
            </label>


            <StyledSelect
              name="component1"
              value={values.component1}
              options={categoryOption}
              onChange={({ name, value }) => {
                setFieldValue(name, value);
              }}
              onBlur={() => {
                setFieldTouched("component1", true);
              }}
            />

            <FormikValidationError name="component" errors={errors} touched={touched} />
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="" className="mr-1 ">
              {t("maintainance:logType")}
            </label>

            <StyledSelect
              name="log_type"
              options={LOG_TYPE_OPTIONS}
              value={LOG_TYPE_OPTIONS?.find((opt: any) => opt.label === values?.log_type) || null}
              onChange={({ name, value }) => {
                setFieldValue(name, value && value["value"]);
              }}
              onBlur={() => {
                setFieldTouched("log_type", true);
              }}
            />
            <FormikValidationError name="log_type" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 ">
              {/* {t("home:maintainance")} {t("home:date")} : */}
              {props.logType ? (`${t("home:issue")} ${t("home:date")}`) : (`${t("home:maintenance")} ${t("home:date")}`)}
            </label>

            {props.scheme?.system_date_format === "nep" ? (
              <>
                <NepaliDatePicker
                  value={values.maintenance_date}
                  name="maintenance_date"
                  onChange={(e) => {
                    setFieldValue("maintenance_date", e);
                  }}
                />
              </>
            ) : (
              <>
                <EnglishDatePicker
                  name="maintenance_date"
                  value={values.maintenance_date}
                  handleChange={(e) => {
                    setFieldValue("maintenance_date", formatDate(e));
                  }}
                />
              </>
            )}
            <FormikValidationError name="maintenance_date" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 ">
              {t("finance:causeofFailure")} :
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
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 ">
              {/* {t("home:maintainance")} {t("home:action")} */}
              {/* {t("home:proposed")}: */}
              {props.logType ? (`${t("home:maintenance")} ${t("home:action")} ${t("home:proposed")}`) : (`${t("home:maintenance")} ${t("home:action")}`)}
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
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 ">
              {/* {t("home:interval")} */}
              {t("home:timerequired")}
            </label>

            <div className="input-group component-logs">
              <input
                type="number"
                className="form-control"
                name="duration"
                value={values.duration}
                onChange={(e) => {
                  handleChange(e);
                  handleMaintenanceIntervalChange(e.target.value, values?.interval_unit)
                }}
                onBlur={handleBlur}
              />
              <select
                id="border-left"
                className="form-control"
                name="interval_unit"
                value={values.interval_unit}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value !== "Year")
                    setFieldValue("next_action", props.scheme?.tool_start_date);
                }}
                onBlur={handleBlur}
              >
                <option value="Year">Year</option>
                <option value="Month">Month</option>
                <option value="Day">Day</option>
              </select>
            </div>
            <FormikValidationError name="duration" errors={errors} touched={touched} />
          </div>
        </div>
<<<<<<< HEAD
=======

>>>>>>> ams-final
        <div className="col-lg-12">
          <div className="form-group ">
            <CustomCheckBox
              id={"is_cost_seggregated"}
              label={t("finance:icCostSegregated")}
              checked={values.is_cost_seggregated}
              onChange={(e) => setFieldValue("is_cost_seggregated", e.target.checked)}
            />

            <FormikValidationError name="is_cost_seggregated" errors={errors} touched={touched} />
          </div>
        </div>
        {!values.is_cost_seggregated && (
          <div className="col-md-4">
            <div className="form-group ">
              <label htmlFor="" className="mr-1 ">
                {t("home:total")} {t("home:cost")}:
              </label>
<<<<<<< HEAD

              <input
                type="number"
                className="form-control"
                name="cost_total"
                value={values.cost_total}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormikValidationError name="cost_total" errors={errors} touched={touched} />
            </div>
          </div>
        )}
        {values.is_cost_seggregated && (
          <div className="col-md-4">
            <div className="form-group ">
              <label htmlFor="" className="mr-1 ">
                {t("home:labor")} {t("home:cost")} :
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
        )}
        {values.is_cost_seggregated && (
          <div className="col-md-4">
            <div className="form-group ">
              <label htmlFor="" className="mr-1 ">
                {t("home:material")} {t("home:cost")} :
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
=======

              <input
                type="number"
                className="form-control"
                name="cost_total"
                value={values.cost_total}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormikValidationError name="cost_total" errors={errors} touched={touched} />
            </div>
          </div>
        )}
        {values.is_cost_seggregated && (
          <div className="col-md-4">
            <div className="form-group ">
              <label htmlFor="" className="mr-1 ">
                {t("home:labor")} {t("home:cost")} :
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
        )}
        {values.is_cost_seggregated && (
          <div className="col-md-4">
            <div className="form-group ">
              <label htmlFor="" className="mr-1 ">
                {t("home:consumable")} {t("home:cost")} :
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
        )}
        {values.is_cost_seggregated && (
          <div className="col-md-4">
            <div className="form-group ">
              <label htmlFor="" className="mr-1 ">
                {t("home:replacement")} {t("home:cost")} :
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
        )}

        <div className="col-md-4" hidden={!props.logType}>
          <div className="form-group ml-2">
            <label htmlFor="" className="mr-1">
              {t("finance:logstatus")} :
            </label>

            <div className="d-flex">
              <div className="mr-2">
                <CustomRadio
                  label={"Resolved"}
                  id="Resolved"
                  name="log_status"
                  value={1}
                  checked={values.log_status === true}
                  onChange={(e) => setFieldValue("log_status", true)}
                />
              </div>
              <div className="ml-2">
                <CustomRadio
                  label={"Unresolved"}
                  id="Unresolved"
                  name="log_status"
                  value={2}
                  checked={values.log_status === false}
                  onChange={(e) => setFieldValue("log_status", false)}
                />
              </div>
            </div>

            <FormikValidationError name="log_status" errors={errors} touched={touched} />
          </div>
        </div>


        {/* {props.editData?.componant_picture && (
          <div className="col-md-12">
            <label htmlFor="" className="mr-1 ">
              Component Picture:
            </label>
            <div className="cursor-pointer">
              <SRLWrapper>
                <img
                  src={props.editData?.componant_picture}
                  alt=""
                  className="component-log-image"
                />
              </SRLWrapper>
            </div>
          </div>
        )} */}

        <div className="col-lg-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("finance:componentPicture")}
              <TooltipLabel id="component_picture" text={t("home:compicture")} />:
            </label>

            <input
              type="file"
              multiple
              accept="image/png, image/jpeg"
              className="form-control"
              name="componant_picture"
              onChange={(e) => {
                setImagePreview([]);
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  setFieldValue(e.target.name, e.target.files);
                  files.map(handleImagePreview);
                }
                // console.log(files)
              }}
              onBlur={handleBlur}
            />
            <FormikValidationError name="next_action" errors={errors} touched={touched} />
>>>>>>> ams-final
          </div>
        )}
        {values.is_cost_seggregated && (
          <div className="col-md-4">
            <div className="form-group ">
              <label htmlFor="" className="mr-1 ">
                {t("home:replacement")} {t("home:cost")} :
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
        )}
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1 ">
              {t("finance:remarks")} :
            </label>

            <input
              className="form-control"
              name="remarks"
              value={values.remarks}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="remarks" errors={errors} touched={touched} />
          </div>
        </div>
<<<<<<< HEAD
        {props.editData?.componant_picture && (
          <div className="col-md-12">
            <label htmlFor="" className="mr-1 ">
              Component Picture:
            </label>
            <div className="cursor-pointer">
              <SRLWrapper> 
                <img
                  src={props.editData?.componant_picture}
                  alt=""
                  className="component-log-image"
                />
              </SRLWrapper>
            </div>
          </div>
        )}
=======
        
        <div className="col-lg-4 d-flex justify-evenly overflow-auto">
          {imagePreview.map((img, idx) => (
            <div className="form-group p-1" key={idx}>
              <div className="d-flex align-vertical justify-content-start">
                {[img].flat().map((src, i) => {
                  return <a href={src} key={i}>
                    <img src={src} alt="" width={150} height={100} className="p-1" />
                  </a>;
                })}
              </div>
            </div>
          ))}
        </div>
>>>>>>> ams-final

        <div className="col-md-12 mt-2 text-right">
          <Button
            className="btn custom-btn mr-2"
            text={t("home:save")}
            type="submit"
            disabled={props.postLoading || props.updateLoading}
            loading={props.postLoading || props.updateLoading}
          />
          <Button
            className="btn custom-btn-outlined mr-3"
            text={t("home:cancel")}
            onClick={() => props.toggle()}
            type="button"
          />
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = (state: RootState) => ({
  yearIntervals: state.waterSchemeData.getYearIntervals.data,
  language: state.i18nextData.languageType,
  components: state.component.getComponent.data,
  postLoading: state.componentLogs.postComponentLogs.isFetching,
  updateLoading: state.componentLogs.updateComponentLogs.isFetching,
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  componentData: state.maintainanceData.dashboardComponentInfoData.data,
  componentInfoOptions: state.maintainanceData.dashboardComponentInfoData.data?.map((item) => ({
    label: item?.component?.name,
<<<<<<< HEAD
    value: item?.component?.id,
=======
    value: item?.id,
>>>>>>> ams-final
  })),
  // componentsOptions: state.maintainanceData.componentsData.data?.map((item) => ({
  //   label: item?.component1?.name,
  //   value: item?.id,
  // })),
});

const mapDispatchToProps = {
  getComponentAction,
  postComponentInfoAction,
  updateComponentInfoAction,
  postComponentLogsAction: postComponentLogsAction,
  updateComponentLogsAction: updateComponentLogsAction,
  getComponentInfoAction: getComponentInfoAction,
  getSupplyBeltsAction: getSupplyBeltsAction,
  getComponentLogsAction: getComponentLogsAction,
  getDashboardComponentInfoAction: getDashboardComponentInfoAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ComponentLists);
