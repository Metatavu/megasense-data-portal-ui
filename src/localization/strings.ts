import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {

  /**
   * Translations for authentication
   */
  auth: {
    login: string;
    logout: string;
    register: string;
    guestUser: string;
  };

  /**
   * Translations for routes
   */
  routes: {
    deleteRoute: string;
    savedRoutes: string;
    saveRoute: string;
    findRoute: string;
    showMore: string;
    showLess: string;
    deleteDialog: string;
    deleteButton: string;
    cancelButton: string;
  };

  frontPage: string;
  hello: string;
  to: string;
  from: string;
  map: string;
  savedRoutes: string;
  savedRoutesTo: string;
  savedRoutesFrom: string;
  savedRoutesSavedText: string;
  deleteConfirm: string;
  yes: string,
  statistics: string;
  pollutantPM25: string;
  pollutantPM10: string;
  pollutantOzone: string;
  pollutantNitrogen: string;
  pollutanSulfur: string;
  cancel: string;
  confirmTimeRange: string;
  selectPollution: string;
  reset: string,
  weeklyExposure: string,
  monthlyExposure: string,
  annualExposure: string
  displayTables: string;
  selectTime: string;
  settings: string;
  airQualityMode: string;
  movementOptions: string;
  walking: string;
  wheelerchair: string;
  homeAddress: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  country: string;
  applyChanges: string;
  downloadData: string;
  changeUserData: string;
  deleteAccount: string;
  deleteAccountDialogTitle: string;
  deleteAccountDialogText: string;
  viewRoute: string;
  deleteRoute: string;
  collapseMenuText: string;
  user: string;
  postalCode: string;
  confirmButtonText: string;
  locationNotFoundDialogText: string;
  about: string;
  aboutScreen: {
    title: string;
    subTitle: string;
    descriptionText: string;
  };
}

const strings: IStrings = new LocalizedStrings({
  fi: require("./fi.json"),
  en: require("./en.json")
});

export default strings;