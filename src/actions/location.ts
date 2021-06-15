import { FavouriteLocation } from "../generated/client";
import * as ActionTypes from "../constants/action-types";

/**
 * Interface desicribing displayed location update action
 */
export interface SetDisplayedFavouriteLocationAction {
  type: ActionTypes.SET_DISPLAYED_LOCATION,
  displayedFavouriteLocation?: FavouriteLocation
}

/**
 * Redux displayed location update action
 * 
 * @param displayedFavouriteLocation a new location
 */
export const setDisplayedFavouriteLocation = (displayedFavouriteLocation?: FavouriteLocation): SetDisplayedFavouriteLocationAction => {
  return {
    type: ActionTypes.SET_DISPLAYED_LOCATION,
    displayedFavouriteLocation: displayedFavouriteLocation
  };
}

export type LocationAction = SetDisplayedFavouriteLocationAction;
