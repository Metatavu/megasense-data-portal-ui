import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";
const drawerWidth = 240;
export const styles = createStyles({
  root: {
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    color: "#ffffff",
    fontSize: 40,
    marginTop: 20,
    marginBottom: "auto"
  }
});