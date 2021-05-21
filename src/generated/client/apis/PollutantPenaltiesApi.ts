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
    PollutantPenalty,
    PollutantPenaltyFromJSON,
    PollutantPenaltyToJSON,
} from '../models';

export interface CreatePollutantPenaltyRequest {
    pollutantPenalty: PollutantPenalty;
}

export interface DeletePollutantPenaltyRequest {
    pollutantPenaltyId: string;
}

export interface FindPollutantPenaltyRequest {
    pollutantPenaltyId: string;
}

export interface UpdatePollutantPenaltyRequest {
    pollutantPenalty: PollutantPenalty;
    pollutantPenaltyId: string;
}

/**
 * no description
 */
export class PollutantPenaltiesApi extends runtime.BaseAPI {

    /**
     * Creates a new pollutant penalty
     */
    async createPollutantPenaltyRaw(requestParameters: CreatePollutantPenaltyRequest): Promise<runtime.ApiResponse<PollutantPenalty>> {
        if (requestParameters.pollutantPenalty === null || requestParameters.pollutantPenalty === undefined) {
            throw new runtime.RequiredError('pollutantPenalty','Required parameter requestParameters.pollutantPenalty was null or undefined when calling createPollutantPenalty.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/PollutantPenalties`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PollutantPenaltyToJSON(requestParameters.pollutantPenalty),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PollutantPenaltyFromJSON(jsonValue));
    }

    /**
     * Creates a new pollutant penalty
     */
    async createPollutantPenalty(requestParameters: CreatePollutantPenaltyRequest): Promise<PollutantPenalty> {
        const response = await this.createPollutantPenaltyRaw(requestParameters);
        return await response.value();
    }

    /**
     * Deletes pollutant penalty
     */
    async deletePollutantPenaltyRaw(requestParameters: DeletePollutantPenaltyRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.pollutantPenaltyId === null || requestParameters.pollutantPenaltyId === undefined) {
            throw new runtime.RequiredError('pollutantPenaltyId','Required parameter requestParameters.pollutantPenaltyId was null or undefined when calling deletePollutantPenalty.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/pollutantPenalties/{pollutantPenaltyId}`.replace(`{${"pollutantPenaltyId"}}`, encodeURIComponent(String(requestParameters.pollutantPenaltyId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes pollutant penalty
     */
    async deletePollutantPenalty(requestParameters: DeletePollutantPenaltyRequest): Promise<void> {
        await this.deletePollutantPenaltyRaw(requestParameters);
    }

    /**
     * Finds a pollutant penalty
     */
    async findPollutantPenaltyRaw(requestParameters: FindPollutantPenaltyRequest): Promise<runtime.ApiResponse<PollutantPenalty>> {
        if (requestParameters.pollutantPenaltyId === null || requestParameters.pollutantPenaltyId === undefined) {
            throw new runtime.RequiredError('pollutantPenaltyId','Required parameter requestParameters.pollutantPenaltyId was null or undefined when calling findPollutantPenalty.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/pollutantPenalties/{pollutantPenaltyId}`.replace(`{${"pollutantPenaltyId"}}`, encodeURIComponent(String(requestParameters.pollutantPenaltyId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PollutantPenaltyFromJSON(jsonValue));
    }

    /**
     * Finds a pollutant penalty
     */
    async findPollutantPenalty(requestParameters: FindPollutantPenaltyRequest): Promise<PollutantPenalty> {
        const response = await this.findPollutantPenaltyRaw(requestParameters);
        return await response.value();
    }

    /**
     * Lists all pollutant penalties
     */
    async getPollutantPenaltiesRaw(): Promise<runtime.ApiResponse<Array<PollutantPenalty>>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/PollutantPenalties`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PollutantPenaltyFromJSON));
    }

    /**
     * Lists all pollutant penalties
     */
    async getPollutantPenalties(): Promise<Array<PollutantPenalty>> {
        const response = await this.getPollutantPenaltiesRaw();
        return await response.value();
    }

    /**
     * Updates pollutant penalty
     */
    async updatePollutantPenaltyRaw(requestParameters: UpdatePollutantPenaltyRequest): Promise<runtime.ApiResponse<PollutantPenalty>> {
        if (requestParameters.pollutantPenalty === null || requestParameters.pollutantPenalty === undefined) {
            throw new runtime.RequiredError('pollutantPenalty','Required parameter requestParameters.pollutantPenalty was null or undefined when calling updatePollutantPenalty.');
        }

        if (requestParameters.pollutantPenaltyId === null || requestParameters.pollutantPenaltyId === undefined) {
            throw new runtime.RequiredError('pollutantPenaltyId','Required parameter requestParameters.pollutantPenaltyId was null or undefined when calling updatePollutantPenalty.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/pollutantPenalties/{pollutantPenaltyId}`.replace(`{${"pollutantPenaltyId"}}`, encodeURIComponent(String(requestParameters.pollutantPenaltyId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: PollutantPenaltyToJSON(requestParameters.pollutantPenalty),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PollutantPenaltyFromJSON(jsonValue));
    }

    /**
     * Updates pollutant penalty
     */
    async updatePollutantPenalty(requestParameters: UpdatePollutantPenaltyRequest): Promise<PollutantPenalty> {
        const response = await this.updatePollutantPenaltyRaw(requestParameters);
        return await response.value();
    }

}
