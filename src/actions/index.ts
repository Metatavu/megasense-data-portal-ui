import { KeycloakInstance } from "keycloak-js";
import * as constants from "../constants";
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

export type AppAction = LoginAction | LogoutAction | LocaleUpdate;

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
