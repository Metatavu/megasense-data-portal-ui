import { SET_DISPLAYED_LOCATION } from '../constants/action-types';
import { LocationAction } from '../actions/location';
import { Location } from '../generated/client';
import { Reducer } from "redux";

/**
 * Location state
 */
interface LocationState {
  displayedLocation?: Location;
}

/**
 * Initial locale state
 */
const initialState: LocationState = {
  displayedLocation: undefined
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
        displayedLocation: action.displayedLocation
      };
    default:
      return state;
  }
}