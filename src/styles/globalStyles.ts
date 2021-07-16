import { createStyles } from "@material-ui/core";
import theme from "../theme/theme";

export const globalStyles = createStyles({
  /** Buttons */
  primaryButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.light,
    flex: 1,
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },

  secondaryButton: {
    backgroundColor: theme.palette.secondary.main
  },
  successButton: {
    backgroundColor: theme.palette.success.main
  },
  warningButton: {
    backgroundColor: "transparent",
    color: theme.palette.warning.main,
    flex: 1
  },
  errorButton: {
    backgroundColor: theme.palette.error.main
  },

  /** Loaders */
  errorLoader: {
    color: theme.palette.error.main
  },
  primaryLoader: {
    color: theme.palette.primary.main
  },
});
