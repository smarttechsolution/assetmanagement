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

const outhReducer = combineReducers({
    getIncomeData,
    updateIncome,
    deleteIncome,
    postIncome,
    getIncomeCategory,
    getIncomeExpenseImgae,
    getPreviousIncomeTotal,
    postIncomeCategories,
    updateIncomeCategories
})

export default outhReducer