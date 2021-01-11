import { Route } from "../generated/client";
import * as ActionTypes from "../constants/action-types";

/**
 * Interface desicribing displayed route update action
 */
export interface SetDisplayedRouteAction {
  type: ActionTypes.SET_DISPLAYED_ROUTE,
  displayedRoute?: Route
}

/**
 * Redux displayed route update action
 * 
 * @param displayedRoute a new route
 */
export const setDisplayedRoute = (displayedRoute?: Route): SetDisplayedRouteAction => {
  return {
    type: ActionTypes.SET_DISPLAYED_ROUTE,
    displayedRoute: displayedRoute
  };
}

export type RouteAction = SetDisplayedRouteAction;