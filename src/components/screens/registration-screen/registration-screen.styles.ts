import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";
import backgroundImage from "../../../resources/images/main.jpg";

export default createStyles({

  logoBig: {
    marginBottom: theme.spacing(10)
  },

  title: {
    color: "#fff"
  },

  backgroundContainer: {
    backgroundImage: `url(${ backgroundImage })`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    height: "100%",
    justifyContent: "center",
    alignContent: "space-around"
  },

  registerGrid: {
    width: "420px",
    justifyContent: "center",
    color: "#fff"
  },

  registerButton: {
    width: "100%",
    color:  theme.palette.primary.light,
    borderColor: theme.palette.primary.light,
    margin: theme.spacing(1)
  },

});