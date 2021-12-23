import { createStore, applyMiddleware, compose, Action } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';

import rootReducer, { RootState } from "./root-reducer";

const composeEnhancer = (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) || compose;
const middleware = applyMiddleware(thunk);

const store = createStore(rootReducer, composeEnhancer(middleware));
export default store;

/**
 * Redux Thunk Action extended with ReturnType
 */
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>