/* tslint:disable */
/* eslint-disable */
/**
 * Megasense data portal API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    ExposureInstance,
    ExposureInstanceFromJSON,
    ExposureInstanceToJSON,
} from '../models';

export interface TotalExposureRequest {
    exposedBefore?: Date;
    exposedAfter?: Date;
}

/**
 * no description
 */
export class TotalExposureApi extends runtime.BaseAPI {

    /**
     * Gets the total exposure of a user
     */
    async totalExposureRaw(requestParameters: TotalExposureRequest): Promise<runtime.ApiResponse<ExposureInstance>> {
        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.exposedBefore !== undefined) {
            queryParameters['exposedBefore'] = (requestParameters.exposedBefore as any).toISOString();
        }

        if (requestParameters.exposedAfter !== undefined) {
            queryParameters['exposedAfter'] = (requestParameters.exposedAfter as any).toISOString();
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/totalExposure`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => ExposureInstanceFromJSON(jsonValue));
    }

    /**
     * Gets the total exposure of a user
     */
    async totalExposure(requestParameters: TotalExposureRequest): Promise<ExposureInstance> {
        const response = await this.totalExposureRaw(requestParameters);
        return await response.value();
    }

}
