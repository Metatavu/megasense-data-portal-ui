import { KeycloakInstance } from "keycloak-js";
import { Route } from "../generated/client";

export type Locale = "fi" | "en";

/**
 * Interface describing the Redux store
 */
export interface StoreState {
  locale: Locale;
  keycloak?: KeycloakInstance;
  accessToken?: AccessToken;
  displayedRoute?: Route;
}

/**
 * Interface describing an access token
 */
export interface AccessToken {
  token: string;
}

/**
 * Interface describing a location
 */
export interface Location {
  name: string;
  coordinates: string;
}
