import { Button, CircularProgress, TextField, withStyles, WithStyles } from "@material-ui/core";
import React, { ChangeEvent } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import strings from "../../../localization/strings";
import AppLayout from "../../layouts/app-layout/app-layout";
import { styles } from "./map-screen.styles";
import { Map, TileLayer, Polyline, Viewport, Marker } from "react-leaflet";
import * as PolyUtil from "polyline-encoded";
import { LatLng, LatLngTuple, LeafletMouseEvent } from "leaflet";
import * as Nominatim from "nominatim-browser";
import Autocomplete, { AutocompleteChangeReason, AutocompleteInputChangeReason } from '@material-ui/lab/Autocomplete';
import Api from "../../../api";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { AirQuality, Route } from "../../../generated/client";
import DrawerMenu from "../../generic/drawer-menu/drawer-menu";
import { ReduxActions, ReduxState } from "../../../store";
import { NullableToken, Location } from "../../../types";
import { setDisplayedRoute } from "../../../actions/route";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles>{
  displayedRoute?: Route;
  accessToken?: NullableToken;
  setDisplayedRoute: typeof setDisplayedRoute;
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
  polyline? : string;
  savingRoute: boolean;
  airQuality: AirQuality[];
  previousZoom: number;
  locationFromTextInput: string;
  locationToTextInput: string;
  loadingUserSettings: boolean;
}

class MapScreen extends React.Component<Props, State> {
  mapRef: React.RefObject<Map>;

  constructor (props: Props) {
    super(props);
    this.state = {
      mapViewport: {
        zoom: 12 , 
        center: [60.1699, 24.9384]
      },
      editingLocationFrom: true,
      loadingRoute: false,
      locationFromOptions: [],
      locationToOptions: [],
      savingRoute: false,
      airQuality: [],
      previousZoom: 12,
      locationFromTextInput: "",
      locationToTextInput: "",
      loadingUserSettings: false
    };

    this.mapRef = React.createRef();

  }

  public componentDidMount = async () => {
    const { displayedRoute, accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    if (displayedRoute) {
     this.displaySavedRoute(displayedRoute);
    } else {
      this.loadUserSettings(accessToken);
    }

    const airQualityApi = Api.getAirQualityApi(accessToken);
    const airQuality = await airQualityApi.getAirQuality({ pollutant: "SULFUR_DIOXIDE", boundingBoxCorner1: "55,20", boundingBoxCorner2: "65,30" });
    this.setState({ airQuality });
  }

  public render = () => {
    const { loadingUserSettings } = this.state;

    if (loadingUserSettings) {
      return (
        <AppLayout>
          <CircularProgress size={ 200 }/>
        </AppLayout>
      );
    }
  
    return (
      <AppLayout>
        <DrawerMenu open={ true } routing= { this.renderRoutingForm() }/>
        { this.renderMap() }
      </AppLayout>
      
    );
  }

  /**
   * Displays already saved route
   * 
   * @param routeToDisplay route to display
   */
  private displaySavedRoute = (routeToDisplay: Route) => {
    const { setDisplayedRoute } = this.props;
    setDisplayedRoute(undefined);
    const route = PolyUtil.decode(routeToDisplay.routePoints);
    const firstItem = route[0];
    const lastItem = route[ route.length - 1 ];

    const locationFromCoordinates = `${ firstItem[0] },${ firstItem[1] }`;
    const locationFrom = { coordinates: locationFromCoordinates, name: routeToDisplay.locationFromName };
    
    const locationToCoordinates = `${ lastItem[0] },${ lastItem[1] }`;
    const locationTo = { coordinates: locationToCoordinates, name: routeToDisplay.locationToName };
    
    const newCenterCoordinates = this.coordinatesFromString(locationFromCoordinates);
    const newState = {
      route, 
      locationFrom, 
      locationTo, 
      locationFromTextInput: routeToDisplay.locationFromName, 
      locationToTextInput: routeToDisplay.locationToName,
      mapViewport: { center: [ newCenterCoordinates[0], newCenterCoordinates[1] ] as [number, number], zoom: 13 }
    }
    this.setState(newState);
  }

  /**
   * Loads user settings
   */
  private loadUserSettings = async () => {
    const { accessToken } = this.props;
    this.setState({ loadingUserSettings: true });
    try {
      const userSettingsApi = Api.getUsersApi(accessToken);
      const userSettings = await userSettingsApi.getUserSettings();
      const { homeAddress } = userSettings;
      
      if (homeAddress) {
        const { streetAddress, postalCode, city, country } = homeAddress;
        const geocodeRequest = { email: "devs@metatavu.fi", street: streetAddress, postalcode: postalCode, city, country };
        const nominatimResponse: Nominatim.NominatimResponse[] = await Nominatim.geocode(geocodeRequest, process.env.REACT_APP_NOMINATIM_URL);
        if (nominatimResponse.length === 1) {
          const center = [Number.parseFloat(nominatimResponse[0].lat), Number.parseFloat(nominatimResponse[0].lon)] as [number, number];
          const mapViewport = { center, zoom: 13 }
          this.setState({ mapViewport });
        }
      }
    } catch (error) {}
    this.setState({ loadingUserSettings: false });
  }

  /**
   * Renders the form for routing
   */
  private renderRoutingForm = (): JSX.Element => {
    const { classes } = this.props;
    const { locationFrom, locationTo, locationFromOptions, locationToOptions, locationFromTextInput, locationToTextInput, loadingRoute, savingRoute } = this.state;

    return (
      <div className={ classes.routingForm }>
        <div className={ classes.routingFormPart }>
          <Autocomplete
            filterOptions={ (options) => options }
            onInputChange={ this.onLocationFromChange } 
            inputValue={ locationFromTextInput } 
            onChange={ this.onLocationFromSelected } 
            options={ locationFromOptions } 
            getOptionLabel={(option: Location) => option.name || ""} 
            value={ locationFrom } 
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
            filterOptions={ (options) => options } 
            onInputChange={ this.onLocationToChange } 
            inputValue={ locationToTextInput } 
            onChange={ this.onLocationToSelected } 
            options={ locationToOptions } 
            getOptionLabel={(option: Location) => option.name || ""} 
            value={ locationTo } 
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
          { !loadingRoute && 
            <Button onClick={ this.updateRoute } className={ classes.routingFormButton }>{ strings.findRoute }</Button>
          }

          {
            loadingRoute &&
            <CircularProgress color="inherit" className={ classes.routingFormLoader } />
          }

          { !savingRoute && 
            <Button onClick={ this.saveRoute } className={ classes.routingFormButton }>{ strings.saveRoute }</Button>
          }

          {
            savingRoute &&
            <CircularProgress color="inherit" className={ classes.routingFormLoader } />
          }

        </div>

      </div>
    );
  }

  /**
   * Renders the map
   */
  private renderMap = (): JSX.Element => {
    const { route, locationFrom, locationTo, airQuality } = this.state;

    return (
      <Map 
        ref={ this.mapRef }
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

        { this.state.mapViewport.zoom === 6 &&
          <HeatmapLayer
            points={ airQuality }
            longitudeExtractor={ (airQuality: AirQuality) => airQuality.location.longitude }
            latitudeExtractor={ (airQuality: AirQuality) => airQuality.location.latitude }
            intensityExtractor={ (airQuality: AirQuality) => airQuality.pollutionValue }
            />
        }

      </Map>
    );
  }

  /**
   * Saves the route that is currently displayed on the map
   */
  private saveRoute = async () => {
    const accessToken = this.props.accessToken;
    const { polyline, locationFrom, locationTo } = this.state;

    if (!accessToken || !polyline || !locationFrom || !locationTo) {
      return;
    }

    try {
      const routesApi = Api.getRoutesApi(accessToken);
      this.setState({ savingRoute: true });

      await routesApi.createRoute({ route: { routePoints: polyline, locationFromName: locationFrom?.name, locationToName: locationTo?.name } });

      this.setState({ savingRoute: false });
    } catch (error) {
      this.setState({ savingRoute: false });
      console.log(error);
    }

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
   * @param locationFromTextInput a new value for the text input for locationFrom
   * @param reason autocomplete change reason
   */
  private onLocationFromChange = async (event: ChangeEvent<{}>, locationFromTextInput: string, reason: AutocompleteInputChangeReason) => {
    this.setState({ locationFromTextInput });
    try {
      const nominatimResponse: Nominatim.NominatimResponse[] = await Nominatim.geocode({ email: "devs@metatavu.fi", q: locationFromTextInput }, process.env.REACT_APP_NOMINATIM_URL);
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
  private onLocationToChange = async (event: ChangeEvent<{}>, locationToTextInput: string, reason: AutocompleteInputChangeReason) => {
    this.setState({ locationToTextInput });
    try {
      const nominatimResponse: Nominatim.NominatimResponse[] = await Nominatim.geocode({ email: "devs@metatavu.fi", q: locationToTextInput }, process.env.REACT_APP_NOMINATIM_URL);
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
      const polyline = jsonResponse.plan.itineraries[0].legs[0].legGeometry.points;
      const route = PolyUtil.decode(polyline);

      const newCenter = [mapViewport.center![0], mapViewport.center![1]];
      if (locationFrom && locationFrom.coordinates) {
        const newCenterCoordinates = this.coordinatesFromString(locationFrom.coordinates);
        newCenter[0] = newCenterCoordinates[0];
        newCenter[1] = newCenterCoordinates[1];
      }

      this.setState({ route, locationFrom, locationTo, loadingRoute: false, mapViewport: { center: newCenter as [number, number], zoom: 13 }, previousZoom: 13, polyline }); 
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
  private onViewportChange = async (mapViewport: Viewport) => {
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
      this.setState({ locationFromOptions, locationFrom: location, editingLocationFrom: false, locationFromTextInput: position });
    } else {
      this.setState({ locationTo: location, editingLocationFrom: true, locationToTextInput: position });
    }
  }

}

/**
 * Redux mapper for mapping store state to component props
 * 
 * @param state store state
 */
export function mapStateToProps(state: ReduxState) {
  return {
    accessToken: state.auth.accessToken,
    displayedRoute: state.displayedRoute.displayedRoute
  };
}

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
export function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
    setDisplayedRoute: (displayedRoute?: Route) => dispatch(setDisplayedRoute(displayedRoute))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapScreen));