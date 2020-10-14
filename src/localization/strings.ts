import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {
  to: string;
  from: string;
  map: string;
  findRoute: string;
  saveRoute: string;
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
  waliking: string;
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
}

const strings: IStrings = new LocalizedStrings({
  fi: require("./fi.json"),
  en: require("./en.json")
});

export default strings;