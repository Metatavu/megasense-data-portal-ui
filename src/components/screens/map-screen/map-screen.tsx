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
import * as Nominatim from "nominatim-browser";
import Autocomplete, { AutocompleteChangeReason, AutocompleteInputChangeReason } from '@material-ui/lab/Autocomplete';

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles>{

}

interface Location {
  name?: string;
  coordinates?: string;
}

/**
 * Interface describing component state
 */
interface State {
  locationFrom?: Location;
  locationTo?: Location;
  route?: LatLng[];
  mapViewport: Viewport;
  editingLocationFrom: boolean;
  loadingRoute: boolean;
  locationFromOptions: Location[];
  locationToOptions: Location[];
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
      loadingRoute: false,
      locationFromOptions: [],
      locationToOptions: []
    };

  }

  public render = () => {
    const { classes } = this.props;
    const { route, locationFrom, locationTo, locationFromOptions, locationToOptions } = this.state;

    const routingComponents = (
      <div className={ classes.routingForm }>
        <div className={ classes.routingFormPart }>
          <Autocomplete 
            onInputChange={ this.onLocationFromChange } 
            inputValue={ locationFrom?.name || "" } 
            onChange={ this.onLocationFromSelected } 
            options={ locationFromOptions } 
            getOptionLabel={(option: Location) => option.name || ""} 
            value={ locationFrom || {} } 
            className={ classes.routingFormInput }
            size="small" 
            renderInput={ (params) => 
              <TextField 
                placeholder={ strings.from } 
                {...params} 
                variant="outlined" 
              /> 
            } 
          />

          <Autocomplete 
            onInputChange={ this.onLocationToChange } 
            inputValue={ locationTo?.name || "" } 
            onChange={this.onLocationToSelected} 
            options={ locationToOptions } 
            getOptionLabel={(option: Location) => option.name || ""} 
            value={ locationTo || {} } 
            className={ classes.routingFormInput }
            size="small" 
            renderInput={ (params) => 
              <TextField 
                placeholder={ strings.to } 
                {...params} 
                variant="outlined" 
              /> 
            } 
          />

        </div>
        <div className={ classes.routingFormPart }>
          { !this.state.loadingRoute && 
            <Button onClick={ this.updateRoute } className={ classes.routingFormButton }>{ strings.findRoute }</Button>
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
 
        <Map 
          zoomControl={ false } 
          ondblclick={ this.addRoutePoint } 
          doubleClickZoom={ false } 
          style={{ width: "100vw", height: window.innerHeight - 140 }} 
          onViewportChange={ this.onViewportChange }  
          viewport={ this.state.mapViewport }
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {
            route && 
            <Polyline positions={ route }/>
          }

          {
            locationFrom?.coordinates &&
            <Marker position={ this.coordinatesFromString(locationFrom.coordinates) }/>
          }

          {
            locationTo?.coordinates &&
            <Marker position={ this.coordinatesFromString(locationTo.coordinates) }/>
          }
          
        </Map>
      </AppLayout>
      
    );
  }

  /**
   * Converts coordinates from string to LatLngTuple
   * 
   * @param stringCoordinates coordinates to convert
   * 
   * @returns coordinates in LatLngTuple format
   */
  private coordinatesFromString = (stringCoordinates: string): LatLngTuple => {
    const coordinates = stringCoordinates.split(",");
    return [ Number.parseFloat(coordinates[0]), Number.parseFloat(coordinates[1]) ];
  }

  /**
   * Fires when a new locationFrom is selected
   * 
   * @param event React event
   * @param locationFrom a new value for locationFrom 
   * @param reason autocomplete change reason
   */
  private onLocationFromSelected = (event: React.ChangeEvent<{}>, locationFrom: Location | null | undefined, reason: AutocompleteChangeReason) => {
    if (locationFrom === null) {
      locationFrom = undefined;
    }
    this.setState({ locationFrom });
  }

  /**
   * Fires when the value of the text input for locationFrom changes and updates the list of options
   * 
   * @param event React event
   * @param name a new value for the text input for locationFrom
   * @param reason autocomplete change reason
   */
  private onLocationFromChange = async (event: ChangeEvent<{}>, name: string, reason: AutocompleteInputChangeReason) => {
    this.setState({ locationFrom: { name } });
    try {
      const nominatimResponse: Nominatim.NominatimResponse[] = await Nominatim.geocode({ email: "devs@metatavu.fi", q: name });
      const locationFromOptions = nominatimResponse.map(option => {
        const coordinates = option.lat + "," + option.lon;
        const name = option.display_name;
        return { name, coordinates };
      });

      this.setState({ locationFromOptions });
    } catch (error) {
      console.log(error);
      this.setState({ locationFromOptions: [] });
    }
  }

  /**
   * Fires when a new locationTo is selected
   * 
   * @param event React event
   * @param locationTo a new value for locationTo
   * @param reason autocomplete change reason
   */
  private onLocationToSelected = (event: React.ChangeEvent<{}>, locationTo: Location | null | undefined, reason: AutocompleteChangeReason) => {
    if (locationTo === null) {
      locationTo = undefined;
    }
    this.setState({ locationTo });
  }

    /**
   * Fires when the value of the text input for locationTo changes and updates the list of options
   * 
   * @param event React event
   * @param name a new value for the text input for locationTo
   * @param reason autocomplete change reason
   */
  private onLocationToChange = async (event: ChangeEvent<{}>, name: string, reason: AutocompleteInputChangeReason) => {
    this.setState({ locationTo: { name } });
    try {
      const nominatimResponse: Nominatim.NominatimResponse[] = await Nominatim.geocode({ email: "devs@metatavu.fi", q: name });
      const locationToOptions = nominatimResponse.map(option => {
        const coordinates = option.lat + "," + option.lon;
        const name = option.display_name;
        return { name, coordinates };
      });

      this.setState({ locationToOptions });
    } catch (error) {
      console.log(error);
      this.setState({ locationToOptions: [] });
    }
  }

  /**
   * Requests a route from Open Trip Planner
   */
  private updateRoute = async () => {
    this.setState({ loadingRoute: true });

    try {
      const { locationTo, locationFrom, mapViewport } = this.state;

      if (locationFrom && !locationFrom.coordinates) {
        locationFrom.coordinates = locationFrom.name;
      }

      if (locationTo && !locationTo.coordinates) {
        locationTo.coordinates = locationTo.name;
      }

      const routingResponse = await fetch(`${ process.env.REACT_APP_OTP_URL }?fromPlace=${ locationFrom?.coordinates }&toPlace=${ locationTo?.coordinates }&time=10:10pm&date=08-29-2019&mode=WALK&option=STRICT_AQ&maxWalkDistance=10000&arriveBy=false&wheelchair=false&locale=en`);
      const jsonResponse = await routingResponse.json();
      const route = PolyUtil.decode(jsonResponse.plan.itineraries[0].legs[0].legGeometry.points);

      const newCenter = [mapViewport.center![0], mapViewport.center![1]];
      if (locationFrom && locationFrom.coordinates) {
        const newCenterCoordinates = this.coordinatesFromString(locationFrom.coordinates);
        newCenter[0] = newCenterCoordinates[0];
        newCenter[1] = newCenterCoordinates[1];
      }

      this.setState({ route, locationFrom, locationTo, loadingRoute: false, mapViewport: { center: newCenter as [number, number], zoom: 13 } }); 
    } catch (error) {
      this.setState({ locationFrom: undefined, locationTo: undefined, route: undefined, loadingRoute: false });
      console.log(error);
    }
  }

  /**
   * Fires when the viewport of the map changes
   * 
   * @param mapViewport a new viewport
   */
  private onViewportChange = (mapViewport: Viewport) => {
    this.setState({ mapViewport });
  }

  /**
   * Fires when user doubleclicks the map
   * 
   * @param mouseEvent mouse event
   */
  private addRoutePoint = (mouseEvent: LeafletMouseEvent) => {
    const position = mouseEvent.latlng.lat.toString() + "," + mouseEvent.latlng.lng.toString();
    const location = { name: position, coordinates: position };
    if (this.state.editingLocationFrom) {
      const locationFromOptions = [location];
      this.setState({ locationFromOptions, locationFrom: location, editingLocationFrom: false });
    } else {
      this.setState({ locationTo: location, editingLocationFrom: true });
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
