import { AirQualityApi, Configuration, ExposureInstancesApi, RoutesApi, TotalExposureApi, UserSettingsApi } from "../generated/client";
import { AccessToken } from "../types";

/**
 * Utility class for loading api with predefined configuration
 */
export default class Api {
  /**
   * Gets initialized routes API
   * 
   * @param accessToken access token
   */
  public static getRoutesApi (accessToken: AccessToken): RoutesApi {
    return new RoutesApi(this.getConfiguration(accessToken));
  }

  /**
   * Gets initialized exposure instances API
   * 
   * @param accessToken access token
   */
  public static getExposureInstancesApi (accessToken: AccessToken): ExposureInstancesApi {
    return new ExposureInstancesApi(this.getConfiguration(accessToken))
  }

  /**
   * Gets initialized total exposure API
   * 
   * @param accessToken access token
   */
  public static getTotalExposureApi (accessToken: AccessToken): TotalExposureApi {
    return new TotalExposureApi(this.getConfiguration(accessToken))
  }

  /**
   * Gets initialized air quality API
   * 
   * @param accessToken access token
   */
  public static getAirQualityApi (accessToken: AccessToken): AirQualityApi {
    return new AirQualityApi(this.getConfiguration(accessToken));
  }

  /**
   * Gets initialized user settings API
   * 
   * @param accessToken access token
   */
  public static getUserSettingsApi (accessToken: AccessToken): UserSettingsApi {
    return new UserSettingsApi(this.getConfiguration(accessToken));
  }

  /**
   * Gets api configuration
   *
   * @param token access token
   */
  private static getConfiguration(accessToken: AccessToken) {
    return new Configuration({
      basePath: process.env.REACT_APP_API_BASE_PATH,
      accessToken: accessToken.token
    });
  }
}