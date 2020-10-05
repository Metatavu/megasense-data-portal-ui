import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {
  to: string;
  from: string;
  map: string;
}

const strings: IStrings = new LocalizedStrings({
  fi: require("./fi.json"),
  en: require("./en.json")
});

export default strings;