import * as yup from 'yup'


export const waterSupplyRecordInitialValues = {
    "supply_date": "",
    "total_supply": ""
};

export const waterSupplyRecordValidationSchema = yup.object({
    supply_date: yup.mixed().required("TThis field is required"),
    total_supply: yup.mixed().required("This field is required"),
})