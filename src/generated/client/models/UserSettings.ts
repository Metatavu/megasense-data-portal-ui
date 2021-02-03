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
import {
    HomeAddress,
    HomeAddressFromJSON,
    HomeAddressFromJSONTyped,
    HomeAddressToJSON,
    PollutantPenalties,
    PollutantPenaltiesFromJSON,
    PollutantPenaltiesFromJSONTyped,
    PollutantPenaltiesToJSON,
    PollutantThresholds,
    PollutantThresholdsFromJSON,
    PollutantThresholdsFromJSONTyped,
    PollutantThresholdsToJSON,
} from './';

/**
 * 
 * @export
 * @interface UserSettings
 */
export interface UserSettings {
    /**
     * 
     * @type {HomeAddress}
     * @memberof UserSettings
     */
    homeAddress?: HomeAddress;
    /**
     * 
     * @type {boolean}
     * @memberof UserSettings
     */
    showMobileWelcomeScreen: boolean;
    /**
     * 
     * @type {PollutantPenalties}
     * @memberof UserSettings
     */
    pollutantPenalties: PollutantPenalties;
    /**
     * 
     * @type {PollutantThresholds}
     * @memberof UserSettings
     */
    pollutantThresholds: PollutantThresholds;
}

export function UserSettingsFromJSON(json: any): UserSettings {
    return UserSettingsFromJSONTyped(json, false);
}

export function UserSettingsFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserSettings {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'homeAddress': !exists(json, 'homeAddress') ? undefined : HomeAddressFromJSON(json['homeAddress']),
        'showMobileWelcomeScreen': json['showMobileWelcomeScreen'],
        'pollutantPenalties': PollutantPenaltiesFromJSON(json['pollutantPenalties']),
        'pollutantThresholds': PollutantThresholdsFromJSON(json['pollutantThresholds']),
    };
}

export function UserSettingsToJSON(value?: UserSettings | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'homeAddress': HomeAddressToJSON(value.homeAddress),
        'showMobileWelcomeScreen': value.showMobileWelcomeScreen,
        'pollutantPenalties': PollutantPenaltiesToJSON(value.pollutantPenalties),
        'pollutantThresholds': PollutantThresholdsToJSON(value.pollutantThresholds),
    };
}


