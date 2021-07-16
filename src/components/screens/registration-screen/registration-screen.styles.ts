import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";
import backgroundImage from "../../../resources/images/main.jpg";

export default createStyles({

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

  registerGrid: {
    width: "420px",
    justifyContent: "center",
    color: theme.palette.primary.light
  },
  
  registerButton: {
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
  },
  
  registerGridInput: {
    width: "420px",
    color: theme.palette.primary.light,
    margin: theme.spacing(1)
  },

  registerWarning: {
    color: theme.palette.error.main,
    textAlign: "left",
    width: "100%",
    fontSize: 12
  }

});