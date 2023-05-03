import * as yup from 'yup'



export const supplyBeltInitialValues = {  
    institutional_connection: "0",
    commercial_connection: "0",
    public_connection: "0",
    household_connection: "0",
    apply_date: ""
};

export const supplyBeltValidationSchema = yup.object({  
<<<<<<< HEAD
    institutional_connection: yup.string(),
    commercial_connection: yup.string(),
    public_connection: yup.string(),
    household_connection: yup.string(),
=======
    institutional_connection: yup.string().required("This field is required"),
    commercial_connection: yup.string().required("This field is required"),
    public_connection: yup.string().required("This field is required"),
    household_connection: yup.string().required("This field is required"),
>>>>>>> ams-final
    apply_date: yup.string(),
})