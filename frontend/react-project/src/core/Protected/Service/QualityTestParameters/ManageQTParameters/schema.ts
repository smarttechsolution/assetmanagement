import * as yup from 'yup'


export const testParametersInitialValues = {
    parameter_name: "",
    unit: "", 
    types: null as null | OptionType,
    NDWQS_standard: "",
};

export const testParametersValidationSchema = yup.object({
    parameter_name: yup.mixed().required("Parameter name is required"),
    unit: yup.mixed().required("Unit is required"), 
    types: yup.mixed(),
    NDWQS_standard: yup.string(),
})