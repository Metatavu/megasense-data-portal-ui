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
   * Translations for error dialog
   */
  errorDialog: {
    title: string;
    reloadPage: string;
    unsavedContents: string;
    reportIssue: string;
    technicalDetails: string;
    time: string;
    url: string;
    errorMessage: string;
    close: string;
    reload: string;
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
    routeNameInput: string;
  };

  /**
   * Translations for places
   */
  places: {
    deletePlace: string;
    savedPlaces: string;
    savePlace: string;
    findPlace: string;
  };

  /**
   * Translations for statistics screen
   */
  statistics: {
    title: string;
    selectPollution: string;
    selectTimeRange: string;
    daily: string;
    weekly: string;
    monthly: string;
    annual: string;
    carbonMonoxide: string;
    ozone: string;
    nitrogenDioxide: string;
    sulfurDioxide: string;
  };
  
  /**
   * Translations for settings screen
   */
  settings: {
    unsavedChangesWillBeLost: string;
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
    save: string;
    cancel: string;
    reset: string;
    yes: string;
  }
}

const strings: IStrings = new LocalizedStrings({
  fi: require("./fi.json"),
  en: require("./en.json")
});

export default strings;