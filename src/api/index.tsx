import { AirQualityApi, Configuration, ExposureInstancesApi, RoutesApi, TotalExposureApi, UsersApi } from "../generated/client";
import { NullableToken } from "../types";

/**
 * Utility class for loading api with predefined configuration
 */
export default class Api {
  /**
  
   * Gets initialized routes API
   * 
   * @param accessToken access token
   */
  public static getRoutesApi (accessToken?: NullableToken): RoutesApi {
    return new RoutesApi(this.getConfiguration(accessToken));
  }

  /**
   * Gets initialized exposure instances API
   * 
   * @param accessToken access token
   */
  public static getExposureInstancesApi (accessToken?: NullableToken): ExposureInstancesApi {
    return new ExposureInstancesApi(this.getConfiguration(accessToken))
  }

  /**
   * Gets initialized total exposure API
   * 
   * @param accessToken access token
   */
  public static getTotalExposureApi (accessToken?: NullableToken): TotalExposureApi {
    return new TotalExposureApi(this.getConfiguration(accessToken))
  }

  /**
   * Gets initialized air quality API
   * 
   * @param accessToken access token
   */
  public static getAirQualityApi (accessToken?: NullableToken): AirQualityApi {
    return new AirQualityApi(this.getConfiguration(accessToken));
  }

  /**
   * Gets initialized users API
   * 
   * @param accessToken access token
   */
  public static getUsersApi (accessToken?: NullableToken): UsersApi {
    return new UsersApi(this.getConfiguration(accessToken));
  }

  /**
   * Gets api configuration
   *
   * @param token access token
   */
  private static getConfiguration(accessToken?: NullableToken) {
    return new Configuration({
      basePath: process.env.REACT_APP_API_BASE_PATH,
      accessToken: accessToken ? accessToken.access_token : undefined
    });
  }
}
