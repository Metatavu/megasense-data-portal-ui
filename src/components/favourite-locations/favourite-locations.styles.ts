import { createStyles } from "@material-ui/core";
import theme from "../../theme/theme";
import { globalStyles } from "../../styles/globalStyles";

export const styles = createStyles({
  ...globalStyles,


  showMoreButtonContainer: {
    padding: theme.spacing(2),
    display: "flex"
  }

});