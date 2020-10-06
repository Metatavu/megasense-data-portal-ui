import { createStyles } from "@material-ui/core";

export const styles = createStyles({
  routingForm: {
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex"
  },
  routingFormPart: {
    display: "flex",
    flexDirection: "column"
  },
  routingFormInput: {
    margin: 10,
    backgroundColor: "white"
  },
  routingFormButton: {
    margin: 10,
    backgroundColor: "#F6AB6C",
    paddingLeft: 30,
    paddingRight: 30
  },
  routingFormLoader: {
    margin: 10,
    color: "#F6AB6C"
  }
});