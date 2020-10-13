import * as constants from "../constants";
import { AppAction } from "../actions";
import { StoreState } from "../types";

/**
 * Redux reducer
 * 
 * @param storeState store state
 * @param action app action
 * 
 * @returns a new store state
 */
export const processAction = (storeState?: StoreState, action?: AppAction): StoreState => {
  if (!storeState) {
    return {
      locale: "fi"
    }
  }

  if (!action) {
    return storeState
  }

  switch (action.type) {
    case constants.LOCALE_UPDATE:
      return { ...storeState, locale: action.locale }
    case constants.USER_LOGIN:
      const keycloak = action.keycloak;
      const { token, tokenParsed } = keycloak;
      const userId = tokenParsed?.sub;
      const accessToken = token ?
        { token } :
        undefined;
      return { ...storeState, keycloak, accessToken }
    case constants.USER_LOGOUT:
      return { ...storeState, keycloak: undefined }
    default:
      return storeState
  }
}