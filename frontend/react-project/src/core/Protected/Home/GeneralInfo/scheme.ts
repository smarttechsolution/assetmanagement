import * as Yup from 'yup';


export const generalInfoInitialValues = {
    scheme_name: "",
    location: "",
    daily_target: "",
    period: "",
    water_source: [] as OptionType[] | null | [],
    system_date_format: null as OptionType | null ,
    tool_start_date: "",
    system_built_date: "",
    system_operation_from: "",
    system_operation_to: "",
    currency: "",
}


export const generalInfoValidationSchema = Yup.object({
    scheme_name: Yup.string().required("This field is required"),
    location: Yup.string().required("This field is required"),
    daily_target: Yup.string().required("This field is required"),
    tool_start_date: Yup.string().required("This field is required"),
    period: Yup.string().required("This field is required"),
    water_source: Yup.mixed().required("This field is required"),
    system_date_format: Yup.mixed().required("This field is required"),
    system_built_date: Yup.string().required("This field is required"),
    system_operation_from: Yup.string().required("This field is required"),
    system_operation_to: Yup.string().required("This field is required"),
})
