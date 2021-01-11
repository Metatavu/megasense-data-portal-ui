import { SET_DISPLAYED_ROUTE } from '../constants/action-types';
import { RouteAction } from '../actions/route';
import { Route } from '../generated/client';
import { Reducer } from "redux";

/**
 * Route state
 */
interface RouteState {
  displayedRoute?: Route;
}

/**
 * Initial locale state
 */
const initialState: RouteState = {
  displayedRoute: undefined
};

/**
 * Redux reducer for route
 *
 * @param storeState store state of route
 * @param action action of route
 */
export const routeReducer: Reducer<RouteState, RouteAction> = (state = initialState, action): RouteState => {
  switch (action.type) {
    case SET_DISPLAYED_ROUTE:
      return {
        ...state,
        displayedRoute: action.displayedRoute
      };
    default:
      return state;
  }
}