import * as yup from 'yup'


export const mobileUserInitialValues = {
    name: "",
    phone_number: "",
    password1: "",
    password2: "",
    role: null as null | OptionType,
    // is_care_taker: false,
    // general_manager: false,
    // Other: false
};


export const mobileUserValidationSchema = yup.object({
    name: yup.string().required("This field is required."),
    phone_number: yup.string().required("This field is required.")
        .test(
            "phone_number",
            "Please enter a valid 10 digit mobile humber.",
            function (value) { 

                console.log(value, "value")
                return String(value)?.length === 10 
            }
        )
        .test(
            "phone_number",
            "Please enter a valid 10 digit mobile humber.",
            function (value) { 
                return value?.indexOf("+") !== -1 || value?.indexOf("-") !== -1 || true
            }
        ),
    password1: yup.string().min(4, "Password must have at least 4 characters ").required("This field is required."),
    password2: yup.string().required("This field is required.").oneOf([yup.ref('password1'), null], "Password does not match!"),
    // role: yup.string().required("This field is required"),
    
})
export const mobileUserValidationSchemaWithoutPhone = yup.object({
    name: yup.string().required("This field is required."),
    phone_number: yup.string().required("This field is required.")
    .test(
        "phone_number",
            "Please enter a valid 10 digit mobile humber.",
            function (value) { 

                console.log(value, "valuevalue")
                return String(value)?.length === 10 
            }
        )
        .test(
            "phone_number",
            "Please enter a valid 10 digit mobile humber.",
            function (value) { 
                return value?.indexOf("+") !== -1 || value?.indexOf("-") !== -1 || true
            }
            ),
            password1: yup.string().min(4, "Password must have at least 4 characters "),
            password2: yup.string().oneOf([yup.ref('password1'), null], "Password does not match!"),
            // role: yup.string().required("This field is required"),
})