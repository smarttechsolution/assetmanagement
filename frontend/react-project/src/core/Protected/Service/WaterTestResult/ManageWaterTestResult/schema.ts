import { isInteger } from 'formik'
import * as Yup from 'yup'


export const waterTestInitialValues = {
    "date_from": "",
    "date_to": "",
    "test_result_parameter": [
        {
            "parameter": null as any,
            "parameter_name": "",
            "value": null as any,
        }
    ],
}

export const waterTestValidationSchema = Yup.object({
    date_from: Yup.mixed().required("This field is required"),
    // test_result_parameter: Yup.array().of(
    //     Yup.object().shape({
    //         parameter: Yup.mixed().required("This field is required"),
    //         value: Yup.string().required("This field is required"),
    //     })
    // ),
})