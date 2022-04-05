import { combineReducers } from "redux";
import getExpenditureData from './getExpenditure';
import getExpenditureCategory from './getExpenditureCategory';
import getPreviousExpenditureTotal from './getPreviousExpenditureTotal';
import postExpenseCategories from './postExpenseCategories';
import updateExpenseCategories from './updateExpenseCategories';
import deleteExpenseCategory from './deleteExpenseCategory';
import deleteExpense from './deleteExpense';
import updateExpense from './updateExpense';
import postExpense from './postExpense';
import getAllExpenditureData from './getAllExpenditure';

const outhReducer = combineReducers({
  getExpenditureData,
  getAllExpenditureData,
  getExpenditureCategory,
  getPreviousExpenditureTotal,
  postExpenseCategories,
  updateExpenseCategories,
  deleteExpenseCategory,
  deleteExpense,
  updateExpense,
  postExpense,
})

export default outhReducer