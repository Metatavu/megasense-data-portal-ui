import { combineReducers } from "redux";
import { authReducer } from "../reducers/auth";
import { localeReducer } from "../reducers/locale";
import { AuthAction } from "../actions/auth";
import { LocaleAction } from "../actions/locale";

/**
 * Root reducer that wraps all Redux reducers
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  locale: localeReducer
});

/**
 * Type defining Redux store state
 */
export type ReduxState = ReturnType<typeof rootReducer>;

/**
 * Type defining Redux dispatch actions
 */
export type ReduxActions = AuthAction | LocaleAction;
