import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";
import backgroundImage from "../../../resources/images/main.jpg";

export default createStyles({

  logoBig: {
    marginBottom: theme.spacing(5)
  },

  title: {
    color: theme.palette.primary.light
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

  noticeGrid: {
    justifyContent: "center",
    position: "absolute",
    marginTop: theme.spacing(2)
  },

  noticeText: {
    width: "100%",
    color: theme.palette.primary.light,
    textAlign: "center"
  }

});