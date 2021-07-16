import { combineReducers } from "redux";
import { authReducer } from "../reducers/auth";
import { localeReducer } from "../reducers/locale";
import { routeReducer } from "../reducers/route";
import { locationReducer } from "../reducers/location";
import { AuthAction } from "../actions/auth";
import { LocaleAction } from "../actions/locale";
import { RouteAction } from "../actions/route";
import { LocationAction } from "../actions/location";


/**
 * Root reducer that wraps all Redux reducers
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  locale: localeReducer,
  displayedRoute: routeReducer,
  displayedFavouriteLocation: locationReducer
});

/**
 * Type defining Redux store state
 */
export type ReduxState = ReturnType<typeof rootReducer>;

/**
 * Type defining Redux dispatch actions
 */
export type ReduxActions = AuthAction | LocaleAction | RouteAction | LocationAction;
