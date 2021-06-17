export type Locale = "fi" | "en";

/**
 * Enum for determining coordinate direction
 */
export enum GeocodeCoordinate {
  To,
  From
}

/**
 * Union type for nullable access token
 */
export type NullableToken = AccessToken | null;

/**
 * Type for possible routing modes
 */
 export type RoutingModes = "strict" | "efficient" | "relaxed" | "custom";

/**
 * Interface describing an access token
 */
export interface AccessToken {
  created: Date;
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  userId?: string;
  email?: string;
}

/**
 * Interface describing a location
 */
export interface Location {
  name: string;
  coordinates: string;
}

/**
 * Interface describing routing modes
 */
export interface RoutingModeIcons {
  strict: JSX.Element;
  efficient: JSX.Element;
  relaxed: JSX.Element;
  custom?: JSX.Element;
}

/**
 * Interface describing coordinate point
 */
export interface PointCoordinates {
  lat: number;
  lng: number;
}
