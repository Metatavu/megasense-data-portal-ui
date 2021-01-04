import { createStyles, Toolbar } from '@material-ui/core';
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
    width: 320,
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.primary.main
  },

  inputFieldContainer: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(2)
  },

  routingFormInput: {
    marginTop: theme.spacing(2),
    color: "#fff"
  },


  routingFormPart: {

  },

  routingFormButton: {

  },

  routingFormLoader: {

  },
});
