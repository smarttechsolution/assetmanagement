import { combineReducers } from "redux";
import getInflationParameters from './getInflationParameters';
import deleteInflationParameters from './deleteInflationParameters';
import updateInflationParameters from './updateInflationParameters';
import postInflationParameters from './postInflationParameters';

const outhReducer = combineReducers({
  getInflationParameters,
  deleteInflationParameters,
  updateInflationParameters,
  postInflationParameters,
})

export default outhReducer