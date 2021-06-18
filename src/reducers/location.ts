import { SET_DISPLAYED_LOCATION } from '../constants/action-types';
import { LocationAction } from '../actions/location';
import { FavouriteLocation } from '../generated/client';
import { Reducer } from "redux";

/**
 * Location state
 */
interface LocationState {
  displayedFavouriteLocation?: FavouriteLocation;
}

/**
 * Initial locale state
 */
const initialState: LocationState = {
  displayedFavouriteLocation: undefined
};

/**
 * Redux reducer for location
 *
 * @param storeState store state of location
 * @param action action of location
 */
export const locationReducer: Reducer<LocationState, LocationAction> = (state = initialState, action): LocationState => {
  switch (action.type) {
    case SET_DISPLAYED_LOCATION:
      return {
        ...state,
        displayedFavouriteLocation: action.displayedFavouriteLocation
      };
    default:
      return state;
  }
}
