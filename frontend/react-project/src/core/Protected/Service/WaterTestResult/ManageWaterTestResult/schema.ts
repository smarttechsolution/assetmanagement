<<<<<<< HEAD
=======
import { isInteger } from 'formik'
>>>>>>> ams-final
import * as Yup from 'yup'


export const waterTestInitialValues = {
<<<<<<< HEAD
    "date": "2022-03-26",
=======
    "date_from": "",
    "date_to": "",
>>>>>>> ams-final
    "test_result_parameter": [
        {
            "parameter": null as any,
            "parameter_name": "",
<<<<<<< HEAD
            "value": ""
        }
    ]
}

export const waterTestValidationSchema = Yup.object({
    date: Yup.mixed().required("This field is required"),
    test_result_parameter: Yup.array().of(
        Yup.object().shape({
            parameter: Yup.mixed().required("This field is required"),
            value: Yup.string().required("This field is required"),
        })
    ),
=======
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
>>>>>>> ams-final
})