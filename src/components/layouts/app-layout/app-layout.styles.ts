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
  }

});