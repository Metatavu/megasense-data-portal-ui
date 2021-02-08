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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface FavouriteLocation
 */
export interface FavouriteLocation {
    /**
     * 
     * @type {string}
     * @memberof FavouriteLocation
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof FavouriteLocation
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof FavouriteLocation
     */
    latitude: number;
    /**
     * 
     * @type {number}
     * @memberof FavouriteLocation
     */
    longitude: number;
}

export function FavouriteLocationFromJSON(json: any): FavouriteLocation {
    return FavouriteLocationFromJSONTyped(json, false);
}

export function FavouriteLocationFromJSONTyped(json: any, ignoreDiscriminator: boolean): FavouriteLocation {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': json['name'],
        'latitude': json['latitude'],
        'longitude': json['longitude'],
    };
}

export function FavouriteLocationToJSON(value?: FavouriteLocation | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'latitude': value.latitude,
        'longitude': value.longitude,
    };
}


