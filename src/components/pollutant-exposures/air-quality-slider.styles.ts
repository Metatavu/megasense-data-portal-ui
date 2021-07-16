import { createStyles } from "@material-ui/core";
import { globalStyles } from "../../styles/globalStyles";

export const styles = createStyles({
  ...globalStyles,

  slider: {
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%"
  },


  airQualityDataLoader: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    margin: "20px"
  },
  
});
