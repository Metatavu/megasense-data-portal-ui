import { FavouriteLocation } from "../generated/client";
import * as ActionTypes from "../constants/action-types";

/**
 * Interface desicribing displayed route update action
 */
export interface SetDisplayedLocationAction {
  type: ActionTypes.SET_DISPLAYED_LOCATION,
  displayedLocation?: FavouriteLocation
}

/**
 * Redux displayed location update action
 * 
 * @param displayedLocation a new location
 */
export const setDisplayedLocation = (displayedLocation?: FavouriteLocation): SetDisplayedLocationAction => {
  return {
    type: ActionTypes.SET_DISPLAYED_LOCATION,
    displayedLocation: displayedLocation
  };
}

export type LocationAction = SetDisplayedLocationAction;