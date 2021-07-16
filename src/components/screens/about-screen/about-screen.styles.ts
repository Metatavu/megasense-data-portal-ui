import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";
import backgroundImage from "../../../resources/images/main.jpg";

export default createStyles({

  title: {
    color: "#fff",
    fontSize: 36,
    marginBottom: theme.spacing(2),
    textAlign: "center",
    fontWeight: "bold"
  },
  
  subTitle: {
    color: "#fff",
    textAlign: "center",
    lineHeight: "1.6em"
  },

  backgroundContainer: {
    backgroundImage: `url(${ backgroundImage })`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    height: "100%",
    justifyContent: "center",
    alignContent: "space-evenly"
  },

  infoTexts: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    width: "30%",
  }

});