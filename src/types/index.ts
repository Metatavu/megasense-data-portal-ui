import { KeycloakInstance } from "keycloak-js";

export type Locale = "fi" | "en"

/**
 * Interface describing the Redux store
 */
export interface StoreState {
  locale: Locale,
  keycloak?: KeycloakInstance,
  accessToken?: AccessToken
}

/**
 * Interface describing an access token
 */
export interface AccessToken {
  token: string;
}