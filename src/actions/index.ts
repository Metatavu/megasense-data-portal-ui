import { KeycloakInstance } from "keycloak-js";
import * as constants from "../constants";
import { Route } from "../generated/client";
import { Locale } from "../types";

/**
 * Interface describing Redux login action
 */
interface LoginAction {
  type: constants.USER_LOGIN;
  keycloak: KeycloakInstance;
}

/**
 * Interface describing Redux logout action
 */
interface LogoutAction {
  type: constants.USER_LOGOUT;
}

/**
 * Interface describing Redux locale update action
 */
interface LocaleUpdate {
  type: constants.LOCALE_UPDATE,
  locale: Locale
}

/**
 * Interface desicribing displayed route update action
 */
interface DisplayedRouteUpdateAction {
  type: constants.DISPLAYED_ROUTE_UPDATE,
  displayedRoute?: Route
}

export type AppAction = LoginAction | LogoutAction | LocaleUpdate | DisplayedRouteUpdateAction;

/**
 * Redux login action
 * 
 * @param keycloak a new keycloak instance
 */
export const login = (keycloak: KeycloakInstance): LoginAction => {
  return {
    type: constants.USER_LOGIN,
    keycloak
  }
}

/**
 * Redux logout action
 * 
 */
export const logout = (): LogoutAction => {
  return {
    type: constants.USER_LOGOUT
  }
}

/**
 * Redux locale update action
 * 
 * @param locale a new locale
 */
export const updateLocale = (locale: Locale): LocaleUpdate => {
  return {
    type: constants.LOCALE_UPDATE,
    locale
  }
}

/**
 * Redux displayed route update action
 * 
 * @param displayedRoute a new route
 */
export const updateDisplayedRoute = (displayedRoute?: Route): DisplayedRouteUpdateAction => {
  return {
    type: constants.DISPLAYED_ROUTE_UPDATE,
    displayedRoute
  }
}
