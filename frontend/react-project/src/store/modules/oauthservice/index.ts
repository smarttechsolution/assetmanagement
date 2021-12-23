import { combineReducers } from "redux";
import initUserReducer from './initapi';

const outhReducer = combineReducers({
  initUserData: initUserReducer
})

export default outhReducer