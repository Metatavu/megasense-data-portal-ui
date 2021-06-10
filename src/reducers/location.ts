import { SET_DISPLAYED_LOCATION } from '../constants/action-types';
import { LocationAction } from '../actions/location';
import { Location } from '../generated/client';
import { Reducer } from "redux";

/**
 * Location state
 */
interface LocationState {
  displayedFavouriteLocation?: Location;
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
 * @param storeState store state of route
 * @param action action of route
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