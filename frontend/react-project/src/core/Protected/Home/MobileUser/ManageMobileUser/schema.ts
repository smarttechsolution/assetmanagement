import * as yup from 'yup'


export const mobileUserInitialValues = {
    username: "",
    name: "",
    phone_number: "", 
    password1: "",
    password2: ""
};

export const mobileUserValidationSchema = yup.object({
    username: yup.string().required("This field is required."),
    name: yup.string().required("This field is required."),
    phone_number: yup.string().required("This field is required."), 
    password1: yup.string().min(4, "Password must have atleast 4 characters ").required("This field is required."),
    password2: yup.string().required("This field is required.").oneOf([yup.ref('password1'), null], "Password does not match!") , 
})