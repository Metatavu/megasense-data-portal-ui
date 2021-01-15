import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";
import Background from "../../images/main.jpg";

export default createStyles({

  logoBig: {
    marginBottom: theme.spacing(10)
  },

  title: {
    color: "#fff"
  },

  backgroundContainer: {
    backgroundImage: `url(${Background})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    height: "100%",
    justifyContent: "center",
    alignContent: "space-around"
  },

  loginGrid: {
    width: "420px",
    justifyContent: "center"
  },

  logInButton: {
    width: "100%",
    color:  theme.palette.primary.light,
    borderColor: theme.palette.primary.light,
    margin: theme.spacing(1)
  },

});