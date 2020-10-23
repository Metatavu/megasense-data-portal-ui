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
    UserSettings,
    UserSettingsFromJSON,
    UserSettingsToJSON,
} from '../models';

export interface CreateUserSettingsRequest {
    userSettings: UserSettings;
}

export interface UpdateUserSettingsRequest {
    userSettings: UserSettings;
}

/**
 * no description
 */
export class UsersApi extends runtime.BaseAPI {

    /**
     * Creates user settings for the user who is logged in
     */
    async createUserSettingsRaw(requestParameters: CreateUserSettingsRequest): Promise<runtime.ApiResponse<UserSettings>> {
        if (requestParameters.userSettings === null || requestParameters.userSettings === undefined) {
            throw new runtime.RequiredError('userSettings','Required parameter requestParameters.userSettings was null or undefined when calling createUserSettings.');
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
            path: `/users/settings`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserSettingsToJSON(requestParameters.userSettings),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserSettingsFromJSON(jsonValue));
    }

    /**
     * Creates user settings for the user who is logged in
     */
    async createUserSettings(requestParameters: CreateUserSettingsRequest): Promise<UserSettings> {
        const response = await this.createUserSettingsRaw(requestParameters);
        return await response.value();
    }

    /**
     * Deletes the user who is logged in and all their data
     */
    async deleteUserRaw(): Promise<runtime.ApiResponse<void>> {
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
            path: `/users`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes the user who is logged in and all their data
     */
    async deleteUser(): Promise<void> {
        await this.deleteUserRaw();
    }

    /**
     * Downloads the data of the user who is logged in
     */
    async downloadUserDataRaw(): Promise<runtime.ApiResponse<Blob>> {
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
            path: `/users/data`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Downloads the data of the user who is logged in
     */
    async downloadUserData(): Promise<Blob> {
        const response = await this.downloadUserDataRaw();
        return await response.value();
    }

    /**
     * Gets user settings of the user who is logged in
     */
    async getUserSettingsRaw(): Promise<runtime.ApiResponse<UserSettings>> {
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
            path: `/users/settings`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserSettingsFromJSON(jsonValue));
    }

    /**
     * Gets user settings of the user who is logged in
     */
    async getUserSettings(): Promise<UserSettings> {
        const response = await this.getUserSettingsRaw();
        return await response.value();
    }

    /**
     * Updates user settings for the user who is logged in
     */
    async updateUserSettingsRaw(requestParameters: UpdateUserSettingsRequest): Promise<runtime.ApiResponse<UserSettings>> {
        if (requestParameters.userSettings === null || requestParameters.userSettings === undefined) {
            throw new runtime.RequiredError('userSettings','Required parameter requestParameters.userSettings was null or undefined when calling updateUserSettings.');
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
            path: `/users/settings`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UserSettingsToJSON(requestParameters.userSettings),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserSettingsFromJSON(jsonValue));
    }

    /**
     * Updates user settings for the user who is logged in
     */
    async updateUserSettings(requestParameters: UpdateUserSettingsRequest): Promise<UserSettings> {
        const response = await this.updateUserSettingsRaw(requestParameters);
        return await response.value();
    }

}