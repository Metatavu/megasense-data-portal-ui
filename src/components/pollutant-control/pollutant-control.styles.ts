import { createStyles } from "@material-ui/core";
import theme from "../../theme/theme";

export const styles = createStyles({

  button: {
    color: theme.palette.primary.light,
    background: theme.palette.primary.main,
    zIndex: 1,
    pointerEvents: "auto",
  },

  buttonholder: {
    display: "flex",
    width: "100%",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    justifyContent: "space-between"
  },

  mapContainer: {
    margin: theme.spacing(2),
    height: 200,
    width: 200,
    padding: theme.spacing(2),
  },

  toggleMap: {
    pointerEvents: "auto",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.light,
    width: "100%",
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },

  smallMap: {
    height: "67%",
    width: "100%%",
    borderRadius: "4px",
    marginBottom: theme.spacing(2)
  },

  controlText: {
    font: "black",
    background: "white",
    float: "left",
    width: "100%",
    marginLeft: "5%",
    marginright: "5%",
  }

});
