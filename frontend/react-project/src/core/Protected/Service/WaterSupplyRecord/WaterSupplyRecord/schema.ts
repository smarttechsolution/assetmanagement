import * as yup from 'yup'


export const waterSupplyRecordInitialValues = {
    "date_from": "",
    "total_supply": "",
    "date_to": "",
    "supplyendDate": false
};

export const waterSupplyRecordValidationSchema = yup.object({
    date_from: yup.mixed().required("This field is required"),
    // date_to: yup.mixed().required("This field is required"),
    total_supply: yup.mixed().required("This field is required"),
})
