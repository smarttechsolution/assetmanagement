import * as Yup from 'yup'


export const waterTestInitialValues = {
    "date": "2022-03-26",
    "test_result_parameter": [
        {
            "parameter": null as any,
            "parameter_name": "",
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
})