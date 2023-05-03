import { combineReducers } from "redux";
import getIncomeData from './getIcome';
import getIncomeCategory from './getIncomeCategory';
import getPreviousIncomeTotal from './getPreviousIncomeTotal';
import getIncomeExpenseImgae from './getIncomeExpenseImgae';
import postIncomeCategories from './postIncomeCategories';
import updateIncomeCategories from './updateIncomeCategories';
import updateIncome from './updateIncome';
import deleteIncome from './deleteIncome';
import postIncome from './postIncome';
import getAllIncomeData from './getAllIncome';
<<<<<<< HEAD
=======
import getIncomeTotal from './getIncomeTotal';
>>>>>>> ams-final

const outhReducer = combineReducers({
    getIncomeData,
    getAllIncomeData,
    updateIncome,
    deleteIncome,
    postIncome,
    getIncomeCategory,
    getIncomeExpenseImgae,
    getPreviousIncomeTotal,
    postIncomeCategories,
    updateIncomeCategories,
    getIncomeTotal,
})

export default outhReducer