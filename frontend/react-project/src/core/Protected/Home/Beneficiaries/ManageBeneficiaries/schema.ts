import * as yup from 'yup'



export const supplyBeltInitialValues = {
    beneficiary_household: "",
    beneficiary_population: "",
    public_taps: "",
    institutional_connection: "",
    apply_date: ""
};

export const supplyBeltValidationSchema = yup.object({
    beneficiary_household: yup.string().required("This field is required"),
    beneficiary_population: yup.string().required("This field is required"),
    public_taps: yup.string().required("This field is required"),
    institutional_connection: yup.string().required("This field is required"),
    apply_date: yup.string().required("This field is required"), 
})