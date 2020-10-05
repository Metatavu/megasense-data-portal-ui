import { TextField, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "../../../actions";
import strings from "../../../localization/strings";
import { StoreState } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { styles } from "./map-screen.styles";
import { Map, TileLayer } from "react-leaflet";
import { LeafletEvent } from "leaflet";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles>{

}

/**
 * Interface describing component state
 */
interface State {

}

class MapScreen extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {

    };
  }

  public render = () => {
    const { classes } = this.props;
    const routingComponents = (
      <div className={ classes.routingForm }>
        <TextField className={ classes.routingFormInput } size="small" placeholder={ strings.from } variant="outlined" />
        <TextField className={ classes.routingFormInput } size="small" placeholder={ strings.to } variant="outlined" />
      </div>
    );


    return (
      <AppLayout routing={ routingComponents }>
 
        <Map style={{width: "100vw", height: "100vh", overflow: "hidden"}}  viewport={{zoom: 13 , center: [51.505, -0.09] }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
        </Map>


      </AppLayout>
      
    );
  }



}

/**
 * Redux mapper for mapping store state to component props
 * 
 * @param state store state
 */
export function mapStateToProps(state: StoreState) {
  return {
    accessToken: state.accessToken
  };
}

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapScreen));