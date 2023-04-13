import FormikValidationError from "components/React/FormikValidationError/FormikValidationError";
import toast from "components/React/ToastNotifier/ToastNotifier";
import Button from "components/UI/Forms/Buttons";
import TooltipLabel from "components/UI/TooltipLabel";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { getSupplyBeltsAction } from "store/modules/supplyBelts/getWaterSupplyBelts";
import { getSchemeUserAction } from "store/modules/waterScheme/getWaterSchemeUser";
import { postWaterSchemeUserAction } from "store/modules/waterScheme/postWaterSchemeUser";
import { updateWaterSchemeUserAction } from "store/modules/waterScheme/updateWaterSchemeUser";
import { RootState } from "store/root-reducer";
import {
  mobileUserInitialValues,
  mobileUserValidationSchema,
  mobileUserValidationSchemaWithoutPhone,
  // role__OptionType,
} from "./schema";
import StyledSelect from "components/React/StyledSelect/StyledSelect";
import * as Yup from "yup";


interface Props extends PropsFromRedux {
  editData: any;
  toggle: any;
  setEditData: any;
}

const role__OptionType = [
  {
      label: "Caretaker",
      value: "is_care_taker"
  },
  {
      label: "General Manager",
      value: "general_manager"
  },
  {
      label: "Other",
      value: "other"
  },
  {
    label: "Administrative Staff",
    value: "is_administrative_staff"
  }
]


const Form = (props: Props) => {
  const { t } = useTranslation(["home"]);

  const [initialData, setInitialData] = React.useState(mobileUserInitialValues);


  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema: props.editData
      ? mobileUserValidationSchemaWithoutPhone
      : mobileUserValidationSchema,
    onSubmit: async (submitValue, { resetForm }) => {
      const requestData = {
      ...submitValue,
      role: submitValue?.role?.value,
      // is_care_taker: submitValue?.is_care_taker?.value
    }
      let res;
      if (props.editData) {
        res = await props.updateWaterSchemeUserAction(props.editData.id, requestData);
      } else {
        res = await props.postWaterSchemeUserAction(requestData);
      }

      console.log(res, "resss");

      if (res.status === 201 || res.status === 200) {
        if (res.status === 201) {
          resetForm();
          toast.success(t("home:postSuccess"));
        } else {
          setInitialData(mobileUserInitialValues);
          toast.success(t("home:updateSuccess"));
          console.log(setInitialData, "update successfull");
          
        }
        props.setEditData(null);
        props.getSchemeUserAction();
      } else {
        const errors = Object.values(res.data)?.map((item: any) => {
          toast.error(item[0]);
        });
      }
    },
  });



  React.useEffect(() => {
    if (props.editData) {
        console.log(props.editData);

        const role_name = props.editData.general_manager ? 'general_manager'
            : (props.editData.is_care_taker ? 'is_care_taker' : (props.editData.Other ? 'other' : (props.editData.is_administrative_staff ? 'is_administrative_staff' : '')));
        const role = props.editData.general_manager ? 'General Manager'
            : (props.editData.is_care_taker ? 'Caretaker' : (props.editData.Other ? 'Other' : (props.editData.is_administrative_staff ? 'Administrative Staff' : '')));

        setInitialData({
            ...props.editData,
            role: { label: role, value: role_name }
        });
    }
  }, [props.editData]);

  // React.useEffect(() => {
  //   if (props.editData) {
  //     console.log(props.editData);

  //     const role_name = props.editData.general_manager ? 'general_manager' 
  //     : (props.editData.is_care_taker ? 'is_care_taker' :  (props.editData.Other ? 'other' : ''));
  //     const role = props.editData.general_manager ? 'General Manager' 
  //     : (props.editData.is_care_taker ? 'Caretaker' : (props.editData.Other ? 'Other' : ''));
      
  //     setInitialData({
  //       ...props.editData,
  //       role: {label: role, value: role_name}
  //     });
  //   }
  // }, [props.editData]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <div className="row">
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:name")}:
            </label>

            <input
              className="form-control"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormikValidationError name="name" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:phone")}:
            </label>

            <input
              type={"text"}
              className="form-control"
              name="phone_number"
              value={values.phone_number}
              onChange={(event) => {
                if (Number(event.target.value) || Number(event.target.value) === 0) {
                  setFieldValue(event.target.name, event.target.value);
                }
                if (event.target.value) {
                }
              }}
              onBlur={handleBlur}
              maxLength={10}
            />
            <FormikValidationError name="phone_number" errors={errors} touched={touched} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:password")} ({t("home:pin")}){" "}
              <TooltipLabel
                id={"psba4"}
                text={t("home:pwd")}
              />
              :
            </label>

            <input
              className="form-control"
              name="password1"
              type="number"
              value={values.password1}
              onChange={handleChange}
            />
            <FormikValidationError name="password1" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group ">
            <label htmlFor="" className="mr-1">
              {t("home:confirmpassword")}:
            </label>

            <input
              className="form-control"
              name="password2"
              type="number"
              value={values.password2}
              onChange={handleChange}
            />
            <FormikValidationError name="password2" errors={errors} touched={touched} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="" className="mr-1 ">
              {t("home:role")}
            </label>

            <StyledSelect
              name="role"
              value={values.role}
              options={role__OptionType}
              onChange={({name, value}) => {
                setFieldValue(name, value)
                console.log(value, "vall");
              }}
              onBlur={() => {
                setFieldTouched("role", true);
              }}
            />

            <FormikValidationError name="role" errors={errors} touched={touched} />
          </div>
        </div>

        <div className="col-md-12 text-right">
          <Button
            className="btn custom-btn  mr-3"
            text={t("home:save")}
            disabled={props.postLoading || props.updateLoading}
            loading={props.postLoading || props.updateLoading}
          />
          <Button
            className="btn custom-btn-outlined mr-3"
            text={t("home:cancel")}
            type="button"
            onClick={() => {
              props.toggle();
            }}
          />
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = (state: RootState) => ({
  language: state.i18nextData.languageType,
  schemeSlug: state.waterSchemeData.waterSchemeDetailsData.data?.slug,
  supplySchedule: state.waterSupplyData.waterScheduleData.data,
  supplyBelts: state.supplyBeltsData.getSupplyBeltData.data,
  postLoading: state.waterSchemeData.postWaterSchemeUser.isFetching,
  updateLoading: state.waterSchemeData.updateWaterSchemeUser.isFetching,
});

const mapDispatchToProps = {
  getSupplyBeltsAction,
  postWaterSchemeUserAction,
  getSchemeUserAction,
  updateWaterSchemeUserAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Form);
