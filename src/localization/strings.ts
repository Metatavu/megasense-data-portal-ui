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
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
    passwordCheckFail: string;
  };

  /**
   * Translations for welcome screen
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
   * Translations for timepicker
   */
  timePicker: {
    today: string;
    cancel: string;
    clear: string;
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
    notice: string;
  };

  /**
   * Translations for routes
   */
  routes: {
    deleteRoute: string;
    savedRoutes: string;
    saveRoute: string;
    findRoute: string;
    deleteDialog: string;
    deleteButton: string;
    cancelButton: string;
    routeNameInput: string;
  };

  /**
   * Translations for places
   */
  locations: {
    deleteLocation: string;
    savedLocations: string;
    saveLocation: string;
    findLocation: string;
  };

  /**
   * Translations for map screen
   */
  map: {
    myLocation: string;
    zoomIn: string;
    zoomOut: string;
    showDataOverlay: string;
    showMap: string;
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
  departureTime: string;
  departureDate: string;
  savedRoutes: string;
  savedRoutesTo: string;
  savedRoutesFrom: string;
  savedRoutesSavedText: string;
  savedLocations: string;
  savedLocationsLatitude: string;
  savedLocationsLongtitude: string;
  savedLocationsSavedText: string;
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
  viewLocation: string;
  deleteRoute: string;
  deleteLocation: string;
  collapseMenuText: string;
  user: string;
  showMore: string;
  showLess: string;

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
  };

  /**
   * Translations for settings drawer
   */
  settingsDrawer: {
    transportation: string;
    descriptionTransportation: string;
    medical: string;
    descriptionMedical: string;
    custom: string;
    descriptionCustom: string;
  };

  medicalConditions: {
    asthma: string;
    ischaemicHeartDisease: string;
    copd: string;
  }
}

const strings: IStrings = new LocalizedStrings({
  fi: require("./fi.json"),
  en: require("./en.json")
});

export default strings;
