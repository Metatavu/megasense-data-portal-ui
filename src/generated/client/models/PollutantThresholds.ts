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
 * @interface PollutantThresholds
 */
export interface PollutantThresholds {
    /**
     * 
     * @type {number}
     * @memberof PollutantThresholds
     */
    carbonMonoxideThreshold?: number;
    /**
     * 
     * @type {number}
     * @memberof PollutantThresholds
     */
    nitrogenMonoxideThreshold?: number;
    /**
     * 
     * @type {number}
     * @memberof PollutantThresholds
     */
    nitrogenDioxideThreshold?: number;
    /**
     * 
     * @type {number}
     * @memberof PollutantThresholds
     */
    ozoneThreshold?: number;
    /**
     * 
     * @type {number}
     * @memberof PollutantThresholds
     */
    sulfurDioxideThreshold?: number;
    /**
     * 
     * @type {number}
     * @memberof PollutantThresholds
     */
    harmfulMicroparticlesThreshold?: number;
}

export function PollutantThresholdsFromJSON(json: any): PollutantThresholds {
    return PollutantThresholdsFromJSONTyped(json, false);
}

export function PollutantThresholdsFromJSONTyped(json: any, ignoreDiscriminator: boolean): PollutantThresholds {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'carbonMonoxideThreshold': !exists(json, 'carbonMonoxideThreshold') ? undefined : json['carbonMonoxideThreshold'],
        'nitrogenMonoxideThreshold': !exists(json, 'nitrogenMonoxideThreshold') ? undefined : json['nitrogenMonoxideThreshold'],
        'nitrogenDioxideThreshold': !exists(json, 'nitrogenDioxideThreshold') ? undefined : json['nitrogenDioxideThreshold'],
        'ozoneThreshold': !exists(json, 'ozoneThreshold') ? undefined : json['ozoneThreshold'],
        'sulfurDioxideThreshold': !exists(json, 'sulfurDioxideThreshold') ? undefined : json['sulfurDioxideThreshold'],
        'harmfulMicroparticlesThreshold': !exists(json, 'harmfulMicroparticlesThreshold') ? undefined : json['harmfulMicroparticlesThreshold'],
    };
}

export function PollutantThresholdsToJSON(value?: PollutantThresholds | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'carbonMonoxideThreshold': value.carbonMonoxideThreshold,
        'nitrogenMonoxideThreshold': value.nitrogenMonoxideThreshold,
        'nitrogenDioxideThreshold': value.nitrogenDioxideThreshold,
        'ozoneThreshold': value.ozoneThreshold,
        'sulfurDioxideThreshold': value.sulfurDioxideThreshold,
        'harmfulMicroparticlesThreshold': value.harmfulMicroparticlesThreshold,
    };
}

