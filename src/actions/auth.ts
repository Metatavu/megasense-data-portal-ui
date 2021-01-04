import { KeycloakInstance } from 'keycloak-js';
import * as ActionTypes from '../constants/action-types';
import { NullableToken } from '../types';

/**
 * Interface for setting keycloak instance
 */
export interface SetKeycloakAction {
  type: ActionTypes.SET_KEYCLOAK;
  keycloak: KeycloakInstance;
}

/**
 * Interface for login action type
 */
export interface LoginAction {
  type: ActionTypes.LOGIN;
  accessToken?: NullableToken;
}

/**
 * Interface for logout action type
 */
export interface LogoutAction {
  type: ActionTypes.LOGOUT;
}

/**
 * Set keycloak instance
 *
 * @param keycloak keycloak instance to store
 */
export function setKeycloak(keycloak: KeycloakInstance): SetKeycloakAction {
  return {
    type: ActionTypes.SET_KEYCLOAK,
    keycloak: keycloak
  };
}

/**
 * Store update method for access token
 *
 * @param accessToken keycloak access token
 */
export function login(accessToken: NullableToken): LoginAction {
  return {
    type: ActionTypes.LOGIN,
    accessToken: accessToken
  };
}

/**
 * Store logout method
 */
export function logout(): LogoutAction {
  return {
    type: ActionTypes.LOGOUT
  };
}

export type AuthAction = SetKeycloakAction | LoginAction | LogoutAction;