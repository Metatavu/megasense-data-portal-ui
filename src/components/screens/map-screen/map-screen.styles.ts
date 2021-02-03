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

  mapComponent: {
    height: "100%"
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

  routingTimeControls: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "max-content",
    color: "rgba(255,255,255,0.5)"
  },

  routingDateControls: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "7px",
    width: "max-content",
    color: "rgba(255,255,255,0.5)"
  },

  departureDate: {
    width: "35%",
    marginLeft: "5%"
  },

  routingFormButton: {
    color:  theme.palette.primary.light,
    marginBottom: theme.spacing(2),
    borderColor: theme.palette.primary.light,
  },

  routingFormLoader: {

  },

  autoCompleteInputWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
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

});
