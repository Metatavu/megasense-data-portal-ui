import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

export const styles = createStyles({
  root: {
  },
  appBar: {
    backgroundColor: theme.palette.primary.main,
    zIndex: theme.zIndex.drawer + 1,
    height: 130
  },
  menuButton: {
    color: "white",
    fontSize: 40,
    marginTop: 20,
    marginBottom: "auto"
  }
});