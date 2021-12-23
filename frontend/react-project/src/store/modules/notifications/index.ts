import { combineReducers } from "redux";
import getNotifications from './getNotifications';
import updateNotifications from './updateNotifications';
import postNotifications from './postNotifications';

const outhReducer = combineReducers({
  getNotifications,
  updateNotifications,
  postNotifications,
})

export default outhReducer