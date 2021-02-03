import { Button, CircularProgress, IconButton, TextField, Toolbar, withStyles, WithStyles } from "@material-ui/core";
import AccessibleIcon from "@material-ui/icons/Accessible";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import DestinationIcon from "@material-ui/icons/LocationOn";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import SaveIcon from "@material-ui/icons/Save";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete, { AutocompleteChangeReason, AutocompleteInputChangeReason } from "@material-ui/lab/Autocomplete";
import { LatLng, LatLngTuple, LeafletMouseEvent } from "leaflet";
import * as Nominatim from "nominatim-browser";
import * as PolyUtil from "polyline-encoded";
import React, { ChangeEvent } from "react";
import { Map, Marker, Polyline, TileLayer, Viewport } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setDisplayedRoute } from "../../../actions/route";
import Api from "../../../api";
import { AirQuality, Route } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import theme from "../../../theme/theme";
import { Location, NullableToken, GeocodeCoordinate } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import SavedRoutes from "../../routes/saved-routes/saved-routes";
import FavouritePlaces from "../../favourite-places/favourite-places";
import { styles } from "./map-screen.styles";
import ConfirmDialog from "../../generic/dialogs/confirm-dialog";


/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles>{
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  displayedRoute?: Route;
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
  userSavedRoutes: Route[];
  userDialogInput?: string;
  error?: string | Error | Response;
}

/**
 * Map screen component
 */
class MapScreen extends React.Component<Props, State> {
  mapRef: React.RefObject<Map>;

  /**
   * Component constructor
   * 
   * @param props props
   */
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
      loadingUserSettings: false,
      userSavedRoutes: []
    };

    this.mapRef = React.createRef();

  }

  /**
   * Component life cycle method
   */
  public componentDidMount = async () => {
    const { displayedRoute, accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    if (displayedRoute) {
      this.displaySavedRoute(displayedRoute);
    } else {
      this.loadUserSettings();
    }

    const airQualityApi = Api.getAirQualityApi(accessToken);
    const airQuality = await airQualityApi.getAirQuality({ pollutant: "SULFUR_DIOXIDE", boundingBoxCorner1: "55,20", boundingBoxCorner2: "65,30" });
    this.setState({ airQuality });

    this.getUserSavedRoutes();
  }

  /**
   * Map screen render method
   */
  public render = () => {
    const { accessToken, keycloak, classes } = this.props;
    const { loadingUserSettings, error } = this.state;

    if (loadingUserSettings) {
      return (
        <AppLayout
          showDrawer={ true }
          drawerContent={
            <div className={ classes.loader }>
              <CircularProgress size={ 64 }/>
            </div>
          }
        >
          <div className={ classes.loader }>
            <CircularProgress size={ 64 }/>
          </div>
        </AppLayout>
      );
    }
  
    return (
      <AppLayout 
        accessToken={ accessToken }
        keycloak={ keycloak }
        showDrawer={ true }
        drawerContent={
          this.renderDrawerContent()
        }
        error={ error }
        clearError={ this.onClearError }
      >
        { this.renderMap() }
        { this.renderSaveRouteConfirmDialog() }
      </AppLayout>
      
    );
  }

  /**
   * Render drawer content
   */
  private renderDrawerContent = () => {
    const { accessToken, classes } = this.props;
    const { userSavedRoutes } = this.state;
    return (
      <>
        <Toolbar />
        <Toolbar className={ classes.toolbar }>
          <IconButton>
            <DirectionsWalkIcon htmlColor="#fff" />
          </IconButton>
          <IconButton>
            <AccessibleIcon htmlColor="#fff" />
          </IconButton>
          <IconButton>
            <DirectionsBikeIcon htmlColor="#fff" />
          </IconButton>
        </Toolbar>
        { this.renderRoutingForm() }
        <SavedRoutes 
          savedRoutes={ userSavedRoutes } 
          showSavedRoutes={ !!accessToken } 
          onDeleteUserSavedRoute={ this.onDeleteUserSavedRoute }
          onUserRouteSelect={ this.onUserRouteSelect }
        />
        {/* <FavouritePlaces
          savedRoutes={ userSavedRoutes } 
          showSavedRoutes={ !!accessToken } 
          onDeleteUserSavedRoute={ this.onDeleteUserSavedRoute }
        /> */}
      </>
    );
  }

  /**
   * Displays already saved route
   * 
   * @param routeToDisplay route to display
   */
  private displaySavedRoute = (routeToDisplay: Route) => {
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

    if (!accessToken) {
      return;
    }

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
   * Loads user saved routes
   */
  private getUserSavedRoutes = async () => {
    const { accessToken } = this.props;
    
    if (!accessToken) {
      return;
    }

    const routesApi = Api.getRoutesApi(accessToken);
    const userRoutes = await routesApi.listRoutes();

    this.setState({
      userSavedRoutes: userRoutes
    });
  }

  /**
   * Deletes user saved route
   *
   * @param routeId route Id string
   */
  private onDeleteUserSavedRoute = async (routeId: string) => {
    const { accessToken } = this.props;
    const { userSavedRoutes } = this.state;
    
    if (!accessToken) {
      return;
    }

    const routesApi = Api.getRoutesApi(accessToken);
    await routesApi.deleteRoute({ routeId: routeId });

    this.setState({
      userSavedRoutes: userSavedRoutes.filter(userSavedRoute => userSavedRoute.id !== routeId)
    });
  }

  /**
   * Renders the form for routing
   */
  private renderRoutingForm = (): JSX.Element => {
    const { classes, accessToken } = this.props;
    const { locationFrom, locationTo, locationFromOptions, locationToOptions, locationFromTextInput, locationToTextInput, loadingRoute, savingRoute } = this.state;

    return (
      <div className={ classes.routingForm }>
        <div className={ classes.inputFieldContainer }>
          <Autocomplete
            filterOptions={ (options) => options }
            onInputChange={ this.onLocationFromChange } 
            inputValue={ locationFromTextInput } 
            onChange={ this.onLocationFromSelected } 
            options={ locationFromOptions } 
            getOptionLabel={(option: Location) => option.name || ""} 
            value={ locationFrom }
            size="small" 
            renderInput={ (params) => 
              <div ref={ params.InputProps.ref } className={ classes.autoCompleteInputWrapper }>
                <MyLocationIcon fontSize="small" htmlColor="#FFF" />
                <TextField
                  variant="standard"
                  className={ classes.routingFormInput }
                  placeholder={ strings.from }
                  { ...params }
                  fullWidth
                />
              </div>
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
            size="small"
            style={{ marginTop: theme.spacing(2) }}
            renderInput={ (params) => 
              <div ref={ params.InputProps.ref } className={ classes.autoCompleteInputWrapper }>
                <DestinationIcon fontSize="small" htmlColor="#FFF" />
                <TextField
                  variant="standard"
                  className={ classes.routingFormInput }
                  placeholder={ strings.to }
                  { ...params }
                  fullWidth
                />
              </div>
            } 
          />
        </div>
        <div className={ classes.routingControls }>
          <Button
            variant="outlined"
            onClick={ this.updateRoute }
            className={ classes.routingFormButton }
            endIcon={
              loadingRoute ?
              <CircularProgress size={ 20 } color="inherit" className={ classes.routingFormLoader } />
              :
              <SearchIcon htmlColor="#fff"
              />
            }
          >
            { strings.routes.findRoute }
          </Button>
          { accessToken &&
            <Button
              variant="outlined"
              onClick={ this.onSaveRouteClick }
              className={ classes.routingFormButton }
              endIcon={
                savingRoute ?
                <CircularProgress size={ 20 } color="inherit" className={ classes.routingFormLoader } />
                :
                <SaveIcon htmlColor="#fff"
                />
              }
              >
              { strings.routes.saveRoute }
            </Button>
          }
        </div>
      </div>
    );
  }

  /**
   * Renders the map
   */
  private renderMap = (): JSX.Element => {
    const { classes } = this.props;
    const { route, locationFrom, locationTo, airQuality } = this.state;

    return (
      <Map
        className={ classes.mapComponent }
        ref={ this.mapRef }
        zoomControl={ false } 
        ondblclick={ this.addRoutePoint } 
        doubleClickZoom={ false } 
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
   * Renders save route dialog
   */
  private renderSaveRouteConfirmDialog = () => {
    const { savingRoute } = this.state;
    return (
      <ConfirmDialog 
          title={ strings.routes.saveRoute } 
          positiveButtonText={ strings.common.save } 
          cancelButtonText={ strings.common.cancel } 
          dialogVisible={ savingRoute } 
          onDialogConfirm={ this.onRouteSaveConfirm } 
          onDialogCancel={ this.onRouteSaveCancel }
          userInput={ this.renderDialogRouteNameInput } />
    )
  }

  /**
   * Renders user input field for dialog
   */
  private renderDialogRouteNameInput = () => {
    const { userDialogInput } = this.state;
    return (
      <TextField
        label={ strings.routes.routeNameInput }
        value={ userDialogInput }
        onChange={ this.onRouteNameInputChange }
      />
    )
  }

  /**
   * Handles save route button click
   */
  private onSaveRouteClick = () => {
    this.setState({
      savingRoute: true
    });
  }

  /**
   * Handles save route confirm dialog button click
   */
  private onRouteSaveConfirm = async () => {
    const { accessToken } = this.props;
    const { polyline, locationFrom, locationTo, userDialogInput, userSavedRoutes } = this.state;

    if (!accessToken || !polyline || !locationFrom || !locationTo || !userDialogInput) {
      return;
    }

    try {
      const routesApi = Api.getRoutesApi(accessToken);
      const createdRoute = await routesApi.createRoute({
        route: {
          name: userDialogInput,
          routePoints: polyline,
          locationFromName: locationFrom?.name, locationToName: locationTo?.name, savedAt: new Date()
        }
      });
      this.setState({
        userSavedRoutes: userSavedRoutes.concat(createdRoute),
        savingRoute: false
      });
    } catch (error) {
      this.setState({
        savingRoute: false,
        error: error
      });
    }
  }

  /**
   * Action handler for route name input
   * 
   * @param action input action
   */
  private onRouteNameInputChange = (action: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({
      userDialogInput: action.target.value
    });
  }

  /**
   * Handles save route dialog cancel button click
   */
  private onRouteSaveCancel = () => {
    this.setState({
      savingRoute: false
    });
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
      this.setState({
        locationFromOptions: [],
        error: error
      });
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
      this.setState({
        locationToOptions: [],
        error: error
      });
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

      const routingResponse = await fetch(`${ process.env.REACT_APP_OTP_URL }?fromPlace=${ locationFrom?.coordinates }&toPlace=${ locationTo?.coordinates }&time=12:30pm&date=08-29-2020&maxWalkDistance=100000&sulfurDioxideThreshold=1&sulfurDioxidePenalty=200`);
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
      this.setState({
        locationFrom: undefined,
        locationTo: undefined,
        route: undefined,
        loadingRoute: false,
        error: error
      });
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
  private addRoutePoint = async (mouseEvent: LeafletMouseEvent) => {
    const position = mouseEvent.latlng.lat.toString() + "," + mouseEvent.latlng.lng.toString();
    const location = { name: position, coordinates: position };
    if (this.state.editingLocationFrom) {
      const locationFromOptions = [location];
      const nominatimResponse: Nominatim.NominatimResponse = await Nominatim.reverseGeocode({ lat: mouseEvent.latlng.lat.toString(), lon: mouseEvent.latlng.lng.toString() }, process.env.REACT_APP_NOMINATIM_URL)
      if (nominatimResponse) {
        this.setState({ locationFromOptions, locationFrom: location, editingLocationFrom: false, locationFromTextInput: nominatimResponse.display_name });
      }
    } else {
      const nominatimResponse: Nominatim.NominatimResponse = await Nominatim.reverseGeocode({ lat: mouseEvent.latlng.lat.toString(), lon: mouseEvent.latlng.lng.toString() }, process.env.REACT_APP_NOMINATIM_URL)
      if (nominatimResponse) {
        this.setState({ locationTo: location, editingLocationFrom: true, locationToTextInput: nominatimResponse.display_name });
      }
    }
  }

  /**
   * Sets locations name from coordinates
   * 
   * @param type GeocodeCoordinate type
   * @param lat lat string
   * @param lon lon string
   */
  private reverseGeocodeCoordinates = async (type: GeocodeCoordinate, lat: string, lon: string) => {
    const nominatimResponse: Nominatim.NominatimResponse = await Nominatim.reverseGeocode({ lat, lon }, process.env.REACT_APP_NOMINATIM_URL);
    const geocodedName = nominatimResponse.display_name;
    if (type === GeocodeCoordinate.To) {
      this.setState({
        locationToTextInput: geocodedName
      });
    }

    if (type === GeocodeCoordinate.From) {
      this.setState({
        locationFromTextInput: geocodedName
      });
    }
  }

  /**
   * Sets currently displayed route
   *
   * @param route route to display
   */
  private onUserRouteSelect = (route: Route) => {
    const sourceCoordinates = route.locationFromName.split(",");
    const destCoordinates = route.locationToName.split(",");
    this.reverseGeocodeCoordinates(GeocodeCoordinate.From, sourceCoordinates[0], sourceCoordinates[1]);
    this.reverseGeocodeCoordinates(GeocodeCoordinate.To, destCoordinates[0], destCoordinates[1]);
    this.displaySavedRoute(route);
  }

  /**
   * Handles Error message clearing
   */
  private onClearError = () => {
    this.setState({
      error: undefined
    });
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
    keycloak: state.auth.keycloak,
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
