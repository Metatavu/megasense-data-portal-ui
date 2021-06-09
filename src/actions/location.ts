import { Location } from "../generated/client";
import * as ActionTypes from "../constants/action-types";

/**
 * Interface desicribing displayed route update action
 */
export interface SetDisplayedLocationAction {
  type: ActionTypes.SET_DISPLAYED_LOCATION,
  displayedLocation?: Location
}

/**
 * Redux displayed location update action
 * 
 * @param displayedLocation a new location
 */
export const setDisplayedLocation = (displayedLocation?: Location): SetDisplayedLocationAction => {
  return {
    type: ActionTypes.SET_DISPLAYED_LOCATION,
    displayedLocation: displayedLocation
  };
}

export type LocationAction = SetDisplayedLocationAction;