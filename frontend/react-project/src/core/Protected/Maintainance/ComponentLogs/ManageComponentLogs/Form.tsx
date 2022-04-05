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
import { getComponentInfoAction } from "store/modules/componentInfo/getComponentInfo";
import { getComponentLogsAction } from "store/modules/componentLogs/getComponentLogs";
import { postComponentLogsAction } from "store/modules/componentLogs/postComponentLogs";
import { updateComponentLogsAction } from "store/modules/componentLogs/updateComponentLogs";
import { getDashboardComponentInfoAction } from "store/modules/maintainance/dashboardComponentInfo";
import { getSupplyBeltsAction } from "store/modules/supplyBelts/getWaterSupplyBelts";
import { RootState } from "store/root-reducer";
import formatDate from "utils/utilsFunction/date-converter";
import * as Yup from "yup";
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
  log_type: Yup.mixed().nullable().required("This field is required"),
  maintenance_date: Yup.string().required("This field is required"),
  possible_failure: Yup.string().required("This field is required"),
  maintenance_action: Yup.string().required("This field is required"),
  duration: Yup.string().required("This field is required"),
  cost_total: Yup.string().required("This field is required"),
  labour_cost: Yup.string().required("This field is required"),
  material_cost: Yup.string().required("This field is required"),
  replacement_cost: Yup.string().required("This field is required"),
  remarks: Yup.string().required("This field is required").nullable(),
});

interface Props extends PropsFromRedux {
  editData: any;
  setEditData: any;
  toggle: any;
}

const ComponentLists = (props: Props) => {
  const { t } = useTranslation();
  const [initialData, setInitialData] = React.useState({
    component: null as null | OptionType,
    log_type: null as null | OptionType,
    maintenance_date: "",
    possible_failure: "",
    maintenance_action: "",
    duration: "",
    cost_total: 0,
    labour_cost: 0,
    material_cost: 0,
    replacement_cost: 0,
    remarks: "",
    is_cost_seggregated: false,
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
        component: values.component?.value,
        cost_total: values?.is_cost_seggregated
          ? Number(values?.material_cost) +
            Number(values?.replacement_cost) +
            Number(values?.labour_cost)
          : values?.cost_total,
      };

      if (props.editData) {
        response = await props.updateComponentLogsAction(
          props.language,
          props.editData.id,
          requestData
        );
      } else {
        response = await props.postComponentLogsAction(props.language, requestData);
      }

      if (response.status === 201 || response.status === 200) {
        if (response.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          setInitialData({
            component: null as null | OptionType,
            log_type: null as null | OptionType,
            maintenance_date: "",
            possible_failure: "",
            maintenance_action: "",
            duration: "",
            cost_total: 0,
            labour_cost: 0,
            material_cost: 0,
            replacement_cost: 0,
            remarks: "",
            is_cost_seggregated: false,
          });
          toast.success(t("home:updateSuccess"));
        }
        props.setEditData(null);
        props.toggle();
        props.getComponentLogsAction(props.language);
      } else {
        const errors = Object.values(response.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }
    },
  });

  React.useEffect(() => {
    if (props.scheme) {
      props.getDashboardComponentInfoAction(props.language, props.scheme?.slug);
    }
  }, [props.scheme]);

  React.useEffect(() => {
    if (props.editData) {
      const editData = {
        ...props.editData,
        cost_total: props.editData?.cost_total || 0,
        labour_cost: props.editData?.labour_cost || 0,
        material_cost: props.editData?.material_cost || 0,
        replacement_cost: props.editData?.replacement_cost || 0,
        component: { value: props.editData.component, label: props.editData.component_name },
      };
      delete editData.componant_picture;
      delete editData.supply_belt;
      setInitialData(editData);
    }
  }, [props.editData]);

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
              {t("maintainance:component")}
            </label>

            <StyledSelect
              name="component"
              options={props.componentInfoOptions || []}
              value={values.component}
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
              {t("home:maintainance")} {t("home:date")} :
            </label>

            {props.scheme?.system_date_format === "nep" ? (
              <>
                <NepaliDatePicker
                  value={values.maintenance_date}
                  name="maintenance_date"
                  onChange={(e) => {
                    setFieldValue("date", e);
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
              {t("finance:possibleFailure")} :
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
              {t("home:maintainance")} {t("home:action")} :
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
              {t("home:duration")}
            </label>

            <input
              type="number"
              className="form-control"
              name="duration"
              value={values.duration}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="duration" errors={errors} touched={touched} />
          </div>
        </div>
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
  language: state.i18nextData.languageType,
  postLoading: state.componentLogs.postComponentLogs.isFetching,
  updateLoading: state.componentLogs.updateComponentLogs.isFetching,
  scheme: state.waterSchemeData.waterSchemeDetailsData.data,
  componentInfoOptions: state.maintainanceData.dashboardComponentInfoData.data?.map((item) => ({
    label: item?.component?.name,
    value: item?.component?.id,
  })),
});

const mapDispatchToProps = {
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
