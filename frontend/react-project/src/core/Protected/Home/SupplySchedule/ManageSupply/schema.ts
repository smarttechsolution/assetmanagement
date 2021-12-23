import * as yup from 'yup'


export type SupplyBeltType = {
    day: string;
    morning_from_time: string;
    morning_to_time: string;
    evening_from_time: string;
    evening_to_time: string;
    supply_belts: any;
};

export const supplyBeltInitialValues: SupplyBeltType = {
    day: "",
    morning_from_time: "05:00",
    morning_to_time: "06:00",
    evening_from_time: "17:00",
    evening_to_time: "18:00",
    supply_belts: null,
};

export const supplyBeltValidationSchema = yup.object({
    day: yup.mixed().required("From day is required"),
    morning_from_time: yup.string().required("Please enter proper time."),
    morning_to_time: yup.string().required("Please enter proper time."),
    evening_from_time: yup.string().required("Please enter proper time."),
    evening_to_time: yup.string().required("Please enter proper time."),
    supply_belts: yup.mixed(),
})