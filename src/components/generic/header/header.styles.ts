import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

export const styles = createStyles({

  appBar: {
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.drawer + 1,
  },

  logoText: {
    fontFamily: "'Marvel', sans-serif",
    color: theme.palette.primary.main,
    fontSize: 24
  },

  logoIcon: {
    color: theme.palette.primary.main,
    alignSelf: "center",
    marginRight: theme.spacing(1)
  },

  logoBox: {
    display: "flex",
    flexDirection: "row",
    marginRight: theme.spacing(2)
  }

});