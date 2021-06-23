import { createStyles } from "@material-ui/core";
import theme from "../../../theme/theme";

export const styles = createStyles({

  loader: {
    display: "flex",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },

  toolbar: {
    backgroundColor: theme.palette.primary.main
  },

  modeToggleGroup: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "10%"
  },

  mapComponent: {
    height: "100%",
  },

  routingForm: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.primary.main
  },

  inputFieldContainer: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },

  routingControls: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column"
  },

  keyboardTimePicker: {
    "& .MuiInputBase-root": {
      color: "#fff"
    },
    "& label": {
      color: "rgba(255,255,255,0.8)",
      "&.Mui-focused": {
        color: "#fff"
      }
    },
    "& .MuiIconButton-root": {
      color: "#fff",
      padding: 0
    },
    "& .MuiInput-underline:after": {
      borderBottom: "2px solid rgba(255,255,255,1)",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "1px solid rgba(255,255,255,0.8)",
    },
    "&:hover": {
      "& .MuiInput-underline:before": {
        borderBottom: "1px solid rgba(255,255,255,1)",
      }
    }
  },

  routingFormButton: {
    color: theme.palette.primary.light,
    marginBottom: theme.spacing(2),
    borderColor: theme.palette.primary.light,
  },

  routingFormLoader: {

  },

  autoCompleteInputWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& .MuiInput-underline:after": {
      borderBottom: "2px solid rgba(255,255,255,1)",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "1px solid rgba(255,255,255,0.8)",
    },
    "&:hover": {
      "& .MuiInput-underline:before": {
        borderBottom: "1px solid rgba(255,255,255,1)",
      }
    }
  },

  routingFormInput: {
    marginLeft: theme.spacing(2),
    "& .MuiInputBase-root": {
      color: "#fff"
    },
    "& .MuiIconButton-root": {
      color: "rgba(255,255,255,0.8)"
    }
  },

  markerPopupBottom: {
    "& .leaflet-popup-pane": {
      marginTop: "150px",
      zIndex: "inherit"
    },
    "& .leaflet-popup-tip-container": {
      visibility: "hidden"
    },
    "& .leaflet-popup-content-wrapper": {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      opacity: 0.8
    }
  },

  popupRoutingMode: {
    display: "flex",
    flexDirection: "row",
    opacity: 1
  },

  markerPopupInfoText: {
    display: "flex",
    flexDirection: "row"
  },

  markerPopupRouteInfoText: {
    marginRight: "58%"
  },

  markerPopupRoutingModeText: {
    textAlign: "center"
  },

});
