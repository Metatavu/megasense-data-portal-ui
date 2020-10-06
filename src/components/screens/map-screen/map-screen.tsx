import { Button, CircularProgress, TextField, withStyles, WithStyles } from "@material-ui/core";
import React, { ChangeEvent } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "../../../actions";
import strings from "../../../localization/strings";
import { StoreState } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { styles } from "./map-screen.styles";
import { Map, TileLayer, Polyline, Viewport, Marker } from "react-leaflet";
import * as PolyUtil from "polyline-encoded";
import { LatLng, LatLngTuple, LeafletMouseEvent } from "leaflet";


/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles>{

}

/**
 * Interface describing component state
 */
interface State {
  locationFrom?: string;
  locationTo?: string;
  route?: LatLng[];
  mapViewport: Viewport;
  editingLocationFrom: boolean;
  loadingRoute: boolean;
}

class MapScreen extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = {
      mapViewport: {
        zoom: 12 , 
        center: [61.6887, 27.2721]
      },
      editingLocationFrom: true,
      loadingRoute: false
    };

  }

  public render = () => {
    const { classes } = this.props;
    const { route, locationFrom, locationTo } = this.state;
    const routingComponents = (
      <div className={ classes.routingForm }>
        <div className={ classes.routingFormPart }>
          <TextField onChange={ this.onLocationFromChange } value={ locationFrom } className={ classes.routingFormInput } size="small" placeholder={ strings.from } variant="outlined" />
          <TextField onChange={ this.onLocationToChange } value={ locationTo } className={ classes.routingFormInput } size="small" placeholder={ strings.to } variant="outlined" />
        </div>
        <div className={ classes.routingFormPart }>
          { !this.state.loadingRoute && 
            <Button onClick={ this.findRoute } className={ classes.routingFormButton }>{ strings.findRoute }</Button>
          }

          {
            this.state.loadingRoute &&
            <CircularProgress color="inherit" className={ classes.routingFormLoader } />
          }

          <Button className={ classes.routingFormButton }>{ strings.saveRoute }</Button>

        </div>

      </div>
    );
  
    return (
      <AppLayout routing={ routingComponents }>
 
        <Map zoomControl={ false } ondblclick={ this.addRoutePoint } doubleClickZoom={ false } style={{ width: "100vw", height: window.innerHeight - 140 }} onViewportChange={ this.onViewportChange }  viewport={ this.state.mapViewport }>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {
            route && 
            <Polyline positions={ route }/>
          }

          {
            locationFrom &&
            <Marker position={ this.positionFromString(locationFrom) }/>
          }

          {
            locationTo &&
            <Marker position={ this.positionFromString(locationTo) }/>
          }
          
        </Map>


      </AppLayout>
      
    );
  }

  private positionFromString = (stringPosition: string): LatLngTuple => {
    const splitPosition = stringPosition.split(",");
    return [ Number.parseFloat(splitPosition[0]), Number.parseFloat(splitPosition[1]) ];
  }

  private onLocationFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ locationFrom: event.currentTarget.value });
  }

  private onLocationToChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ locationTo: event.currentTarget.value });
  }

  private findRoute = async () => {
    this.setState({ loadingRoute: true });

    try {
      const routingResponse = await fetch(`${ process.env.REACT_APP_OTP_URL }?fromPlace=${ this.state.locationFrom }&toPlace=${ this.state.locationTo }&time=10:10pm&date=08-29-2019&mode=WALK&option=STRICT_AQ&maxWalkDistance=10000&arriveBy=false&wheelchair=false&locale=en`);
      const jsonResponse = await routingResponse.json();
      const route = PolyUtil.decode(jsonResponse.plan.itineraries[0].legs[0].legGeometry.points);
      this.setState({ route });
    } catch (error) {
      this.setState({ locationFrom: undefined, locationTo: undefined, route: undefined });
      console.log(error);
    }

    this.setState({ loadingRoute: false });
  }

  private onViewportChange = (mapViewport: Viewport) => {
    this.setState({ mapViewport });
  }

  private addRoutePoint = (mouseEvent: LeafletMouseEvent) => {
    const position = mouseEvent.latlng.lat.toString() + "," + mouseEvent.latlng.lng.toString();

    if (this.state.editingLocationFrom) {
      this.setState({ locationFrom: position, editingLocationFrom: false });
    } else {
      this.setState({ locationTo: position, editingLocationFrom: true });
    }
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