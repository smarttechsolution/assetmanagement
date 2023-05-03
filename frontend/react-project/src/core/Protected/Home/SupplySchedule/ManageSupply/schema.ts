import * as yup from 'yup'


export type SupplyBeltType = {
    day: string;
    time_from: string;
    time_to: string;
<<<<<<< HEAD
=======
    comment: string;
>>>>>>> ams-final
};

export const initialValues: SupplyBeltType = {
    day: "",
    time_from: "",
    time_to: "",
<<<<<<< HEAD
=======
    comment:""
>>>>>>> ams-final
};

export const validationSchema = yup.object({
    day: yup.mixed().required("From day is required"),
    time_from: yup.string().required("Please select time."),
    time_to: yup.string().required("Please select time."),
<<<<<<< HEAD
=======
    comment: yup.string()
>>>>>>> ams-final
})