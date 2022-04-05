import * as yup from 'yup'



export const supplyBeltInitialValues = {  
    institutional_connection: "0",
    commercial_connection: "0",
    public_connection: "0",
    household_connection: "0",
    apply_date: ""
};

export const supplyBeltValidationSchema = yup.object({  
    institutional_connection: yup.string(),
    commercial_connection: yup.string(),
    public_connection: yup.string(),
    household_connection: yup.string(),
    apply_date: yup.string(),
})