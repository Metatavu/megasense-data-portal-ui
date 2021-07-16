import { createStyles } from "@material-ui/core";
import { globalStyles } from "../../../styles/globalStyles";
import theme from "../../../theme/theme";

export const styles = createStyles({
  ...globalStyles,

  title: {
    marginTop: 30
  },

  dialogButtonRow: {
    display: "flex",
    padding: 0,
    paddingTop: theme.spacing(2)
  }

});