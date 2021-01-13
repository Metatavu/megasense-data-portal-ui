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
  };


  /**
   * Translations for authentication
   */
  welcome: {
    hello: string;
  };

  /**
   * Translations for header
   */
  header: {
    statistics: string;
    map: string;
    settings: string;
    about: string;
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

  /**
   * Translations for statistics screen
   */
  statistics: {
    title: string;
    selectPollution: string;
    daily: string;
    weekly: string;
    monthly: string;
    annual: string;
    carbonMonoxide: string;
    ozone: string;
    nitrogenDioxine: string;
    sulfurDioxine: string;
  };
  
  /**
   * Translations for settings screen
   */
  settings: {
    title: string;
    applyChanges: string;
    homeAddress: string;
    streetAddress: string;
    city: string;
    zipCode: string;
    country: string;
    postalCode: string;
    locationNotFoundDialogText: string;
    confirmButtonText: string;
    deleteAccount: string;
    deleteAccountDialogTitle: string;
    deleteAccountDialogText: string;
    changeUserData: string;
    downloadData: string;
  };

  /**
   * Translations for about screen
   */
  aboutScreen: {
    title: string;
    subTitle: string;
    descriptionText: string;
  };
  
  to: string;
  from: string;
  savedRoutes: string;
  savedRoutesTo: string;
  savedRoutesFrom: string;
  savedRoutesSavedText: string;
  deleteConfirm: string;
  confirmTimeRange: string;
  selectPollution: string;
  weeklyExposure: string,
  monthlyExposure: string,
  annualExposure: string
  displayTables: string;
  selectTime: string;
  airQualityMode: string;
  movementOptions: string;
  walking: string;
  wheelerchair: string;
  viewRoute: string;
  deleteRoute: string;
  collapseMenuText: string;
  user: string;

  pollutants: {
    PM25: string;
    PM10: string;
    ozone: string;
    nitrogenOxide: string;
    sulfurOxide: string;
    carbonMonoxide: string;
  };

  common: {
    cancel: string;
    reset: string,
    yes: string,
  }
}

const strings: IStrings = new LocalizedStrings({
  fi: require("./fi.json"),
  en: require("./en.json")
});

export default strings;