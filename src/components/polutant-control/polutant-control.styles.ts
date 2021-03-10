import { createStyles } from "@material-ui/core";
import theme from "../../theme/theme";

export const styles = createStyles({

  button: {
    color:  theme.palette.primary.light,
    background: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    zIndex: 1,
    pointerEvents: "auto",    
  },
  buttonholder: {
    width:"100%"
},
mapContainer:{
  margin: theme.spacing(2),
  height: 200,
  width: 200,
  padding: theme.spacing(2),
},
toggleMap:{
  pointerEvents: "auto",    
},
smallMap: { 
   height: "80%",
   width: "80%",
   margin: theme.spacing(2),

  },
  controlText:{
    font:"black",
    background:"white",
    float: "left",
    width: "100%",
    marginLeft:"5%",
    marginright:"5%"
  }
});
