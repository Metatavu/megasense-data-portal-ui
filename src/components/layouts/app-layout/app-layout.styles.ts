import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

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
    marginLeft: 420
  },

  drawer: {
    width: 420,
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.2)"
  }

});
