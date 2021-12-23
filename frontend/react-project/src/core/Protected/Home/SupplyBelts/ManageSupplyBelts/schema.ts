import * as yup from 'yup'



export const supplyBeltInitialValues = {
    name: "",
    belt_type: "",
    beneficiary_household: "",
    beneficiary_population: "",
    public_taps: "",
    institutional_connection: "",
    coverage_area: ""
};

export const supplyBeltValidationSchema = yup.object({
    name: yup.mixed().required("This field is required"),
    belt_type: yup.mixed().required("This field is required"),
    beneficiary_household: yup.mixed().required("This field is required"),
    beneficiary_population: yup.mixed().required("This field is required"),
    public_taps: yup.mixed().required("This field is required"),
    institutional_connection: yup.mixed().required("This field is required"),
    coverage_area: yup.mixed().required("This field is required"),
})