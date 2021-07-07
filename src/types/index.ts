import { LatLng } from "leaflet";

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
export type RoutingModes = "Strict" | "Efficient" | "Relaxed" | "Custom";

/**
 * Interface describing routing mode
 */
export interface RoutingModeData{
  name: RoutingModes;
  associatedRouteData?: RouteData;
}

/**
 * Type for popup options
 */
export type PopupOptions = "source" | "destination" | "options";

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
  coordinates: LatLng;
}

/**
 * Interface describing routing modes
 */
export interface RoutingModeIcons {
  Strict: JSX.Element;
  Efficient: JSX.Element;
  Relaxed: JSX.Element;
  Custom?: JSX.Element;
}

/**
 * Interface describing coordinate point
 */
export interface PointCoordinates {
  lat: number;
  lng: number;
}

/**
 * Interface describing route data
 */
 export interface RouteData {
  lineCoordinates: LatLng[];
  duration?: string;
}

/**
 * Total exposure of pollutant for the route
 */
export interface RouteTotalAirQuality {
  pollutantName: string;
  pollutionValue: number;
}