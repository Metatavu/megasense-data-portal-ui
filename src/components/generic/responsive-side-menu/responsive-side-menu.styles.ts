import { createStyles } from "@material-ui/core";

export const styles = createStyles({

  menu: {
    marginTop: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  menuContainer: { 
    backgroundColor: "#ccc", 
    height: "100%",
    width: 200
  },
  menuItem: {
    backgroundColor: "#e2dcdc",
    width: "80%",
    display: "flex",
    justifyContent: "center",
    textDecoration: "none",
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: "auto",
    marginRight: "auto"
  },
  menuItemContainer: {
    width: "100%"
  }
});