import { LOGIN, LOGOUT, SET_KEYCLOAK } from '../constants/action-types';
import { KeycloakInstance } from 'keycloak-js';
import { AuthAction } from '../actions/auth';
import { NullableToken } from '../types';

/**
 * Redux auth state
 */
export interface AuthState {
  accessToken?: NullableToken;
  keycloak?: KeycloakInstance;
}

/**
 * Initial exhibition state
 */
const initialState: AuthState = {
  accessToken: undefined,
  keycloak: undefined
}

/**
 * Redux reducer for authorization
 *
 * @param authState auth state
 * @param authAction auth action
 * @returns changed auth state
 */
export function authReducer(authState: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case SET_KEYCLOAK:
      return {
        ...authState,
        keycloak: action.keycloak
      };
    case LOGIN:
      return {
        ...authState,
        accessToken: action.accessToken
      };
    case LOGOUT:
      return {
        ...authState,
        keycloak: undefined,
        accessToken: null
      };
    default:
      return authState;
  }
}