import * as Yup from 'yup';


export const createNotificationInitialValues = {
    "initial_date": "",
    "income_notification_period": '',
    "expenditure_notification_period": '',
    "test_result_notification_period": '',
    "supply_record_notification_period": ''
}


export const createNotificationValidationSchema = Yup.object({
    initial_date: Yup.string().required("This field is required"), 
    income_notification_period: Yup.string().required("This field is required"), 
    expenditure_notification_period: Yup.string().required("This field is required"), 
    test_result_notification_period: Yup.string().required("This field is required"), 
    supply_record_notification_period: Yup.string().required("This field is required"), 
})
