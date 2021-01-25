import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

const drawerWidth = 420;

export const styles = createStyles({

  root: {
    display: "flex",
    height: "100vh",
    flexDirection: "column"
  },

  content: {
    background: theme.palette.background.default,
    flex: "1 1 auto"
  },

  hasDrawer: {
    marginLeft: drawerWidth
  },

  drawer: {
    width: drawerWidth,
    boxShadow: "0 0 30px rgba(0,0,0,0.2)"
  }

});