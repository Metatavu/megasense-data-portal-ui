import * as ActionTypes from '../constants/action-types';

/**
 * Interface for set locale action type
 */
export interface SetLocaleAction {
  type: ActionTypes.SET_LOCALE;
  locale: string;
}

/**
 * Store method for set locale
 *
 * @param locale locale string
 */
export function setLocale(locale: string): SetLocaleAction {
  return {
    type: ActionTypes.SET_LOCALE,
    locale: locale
  };
}

export type LocaleAction = SetLocaleAction;