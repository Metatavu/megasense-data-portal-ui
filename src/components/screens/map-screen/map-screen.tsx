import { Box, Button, CircularProgress, Divider, IconButton, TextField, Toolbar, Typography, withStyles, WithStyles } from "@material-ui/core";
import { Eco, Timer, StarBorder, Timeline, DirectionsBike, DirectionsWalk, Accessible, LocationOn, MyLocation, Save, Search } from '@material-ui/icons';
import Autocomplete, { AutocompleteChangeReason, AutocompleteInputChangeReason } from "@material-ui/lab/Autocomplete";
import { LatLng, LeafletMouseEvent } from "leaflet";
import Geocode from "react-geocode";
import * as PolyUtil from "polyline-encoded";
import React, { ChangeEvent } from "react";
import { Map, Marker, Polyline, Popup, TileLayer, Viewport } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setDisplayedRoute } from "../../../actions/route";
import { setDisplayedFavouriteLocation } from "../../../actions/location";
import Api from "../../../api";
import { AirQuality, Route, FavouriteLocation } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import theme from "../../../theme/theme";
import { Location, NullableToken, GeocodeCoordinate, RouteTotalAirQuality, RoutingModes, RoutingModeIcons, PointCoordinates, RouteData, RoutingModeData } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import SavedRoutes from "../../routes/saved-routes/saved-routes";
import FavouriteLocations from "../../favourite-locations/favourite-locations";
import { styles } from "./map-screen.styles";
import ConfirmDialog from "../../generic/dialogs/confirm-dialog";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { NUMBER_OF_RESULTS_FOR_FAVOURITE_PLACES } from "../../../constants/map"
import PollutantControl from "../../pollutant-control/pollutant-control";
import { sourceIcon } from "../../../resources/images/svg/map-marker-source";
import { destinationIcon } from "../../../resources/images/svg/map-marker-destination";
import AirQualitySlider from "../../pollutant-exposures/air-quality-slider";
import WarningDialog from "../../generic/dialogs/warning-dialog";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles>{
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  displayedRoute?: Route;
  displayedFavouriteLocation?: FavouriteLocation;
  setDisplayedRoute: typeof setDisplayedRoute;
  setDisplayedFavouriteLocation: typeof setDisplayedFavouriteLocation;
}

/**
 * Interface describing component state
 */
interface State {
  locationFrom?: Location;
  locationTo?: Location;
  duplicateLocation?: FavouriteLocation;
  departureTime: Date;
  route?: RouteData;
  routeAltStrict?: RouteData;
  routeAltEfficient?: RouteData;
  routeAltRelaxed?: RouteData;
  mapViewport: Viewport;
  editingLocationFrom: boolean;
  loadingRoute: boolean;
  locationFromOptions: Location[];
  locationToOptions: Location[];
  polyline? : string;
  savingRoute: boolean;
  savingLocation: boolean;
  airQuality: AirQuality[];
  previousZoom: number;
  locationFromTextInput: string;
  locationToTextInput: string;
  loadingUserSettings: boolean;
  userSavedRoutes: Route[];
  userFavouriteLocations: FavouriteLocation[];
  userDialogInput?: string;
  error?: string | Error | Response;
  savingLocationCoordinates?: LatLng;
  mapInteractive: boolean;
  selectedFavouriteLocation?: Location; 
  pollutantControlMapCenter: [number, number];
  heatmapLayerVisible: boolean;
  selectedRoutingMode?: RoutingModeData;
  routeTotalExposures: RouteTotalAirQuality[];
  displayAirQualitySection: boolean;
  loadingRouteAirQuality: boolean;
}

/**
 * Map screen component
 */
class MapScreen extends React.Component<Props, State> {

  private COORDINATE_DELTA = 0.00001; 

  mapRef: React.RefObject<Map>;
  overlayRef: any;
  sourceMarkerRef: React.RefObject<Marker>;
  /**
   * Component constructor
   *
   * @param props props
   */
  constructor (props: Props) {
    super(props);
    this.state = {
      departureTime: new Date(),
      mapViewport: {
        zoom: 12 , 
        center: [60.1699, 24.9384]
      },
      pollutantControlMapCenter: [60.1699, 24.9384],
      editingLocationFrom: true,
      loadingRoute: false,
      locationFromOptions: [],
      locationToOptions: [],
      savingRoute: false,
      savingLocation: false,
      airQuality: [],
      previousZoom: 12,
      locationFromTextInput: "",
      locationToTextInput: "",
      loadingUserSettings: false,
      userSavedRoutes: [],
      userFavouriteLocations: [],
      mapInteractive: true,
      heatmapLayerVisible: false,
      routeTotalExposures: [],
      displayAirQualitySection: false,
      loadingRouteAirQuality: false
    };

    this.mapRef = React.createRef();
    this.overlayRef = React.createRef();
    this.sourceMarkerRef = React.createRef();
  }

  /**
   * Component did mount life cycle method
   */
  public componentDidMount = async () => {
    const { displayedFavouriteLocation, displayedRoute, accessToken } = this.props;

    if (!accessToken) {
      return;
    }

    if (displayedRoute) {
      this.displaySavedRoute(displayedRoute);
    } else {
      this.loadUserSettings();
    }

    if (displayedFavouriteLocation) {
      this.displayFavouriteLocation(displayedFavouriteLocation);
    } else {
      this.loadUserSettings();
    }

    //TODO: enable once AQ file is added
    // const airQualityApi = Api.getAirQualityApi(accessToken);
    // const airQuality = await airQualityApi.getAirQuality({ pollutantId: "SULFUR_DIOXIDE", boundingBoxCorner1: "55,20", boundingBoxCorner2: "65,30" });
    // this.setState({ airQuality });

    this.getUserSavedRoutes();
    this.getUserFavouriteLocations().then(() => this.setLocationOptions());

    //TODO: enable once AQ file is added
    // if (this.mapRef.current != null) {
    //   const map = this.mapRef.current.leafletElement;
    //   const heatLayer = this.overlayRef.current.leafletElement;
    //   map.removeLayer(heatLayer);
    // }
  }

  /**
   * Component did update life cycle method
   */
   public componentDidUpdate = async (prevProps: Props, prevState: State) => {
    const { selectedRoutingMode } = this.state;

    if (selectedRoutingMode && prevState.selectedRoutingMode !== selectedRoutingMode) {
      this.setState({ loadingRouteAirQuality: true });
      const selectedRouteLine = selectedRoutingMode?.associatedRouteData?.lineCoordinates || [];
      await this.updateRouteTotalAirQualityData(selectedRouteLine);
    }
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
        { this.renderSaveLocationConfirmDialog() }
        { this.renderDuplicateLocationConfirmDialog() }
      </AppLayout>
      
    );
  }

  /**
   * Render drawer content
   */
  private renderDrawerContent = () => {
    const { accessToken, classes } = this.props;
    const { userSavedRoutes, userFavouriteLocations, routeTotalExposures, displayAirQualitySection, loadingRouteAirQuality } = this.state;
    return (
      <>
        {/* //TODO: make transportation selector similar to routing mode selector */}
        <Toolbar />
        <Toolbar className={ classes.toolbar }>
          <IconButton>
            <DirectionsWalk htmlColor="#fff" />
          </IconButton>
          <IconButton>
            <Accessible htmlColor="#fff" />
          </IconButton>
          <IconButton>
            <DirectionsBike htmlColor="#fff" />
          </IconButton>
          <div className={ classes.modeToggleGroup }>
            { this.renderRoutingModeSelector() }
          </div>
        </Toolbar>
        { this.renderRoutingForm() }
        <AirQualitySlider routeTotalExposures={ routeTotalExposures } displayRouteAirQuality={ displayAirQualitySection } loadingRouteAirQuality={ loadingRouteAirQuality } />
        <SavedRoutes 
          savedRoutes={ userSavedRoutes } 
          showSavedRoutes={ !!accessToken } 
          onDeleteUserSavedRoute={ this.onDeleteUserSavedRoute }
          onUserRouteSelect={ this.onUserRouteSelect }
        />
        <FavouriteLocations
          savedFavouriteLocations={ userFavouriteLocations } 
          showFavouriteLocations={ !!accessToken } 
          onDeleteUserFavouriteLocation={ this.onDeleteUserFavouriteLocation }
          onUserLocationSelect={ this.onUserLocationSelect }
        />
      </>
    );
  }

  /**
   * Renders air quality routing mode selector
   * 
   * @param size component size
   */
  private renderRoutingModeSelector = (size?: number) => {
    const { selectedRoutingMode } = this.state;
    const routingModeIcons: RoutingModeIcons = {
      Relaxed: <Timer htmlColor="#fff" />,
      Efficient: <Timeline htmlColor="#fff" />,
      Strict: <Eco htmlColor="#fff" />,
      Custom: <StarBorder htmlColor="#fff" />
    };

    if (!routingModeIcons) {
      return;
    }

    return Object.keys(routingModeIcons).map((key, index) => {
      const valueKey = key as keyof RoutingModeIcons;

      const opacity = key !== selectedRoutingMode?.name ? 0.6 : 1; 

      return (
        <IconButton
          style={{
            opacity,
            width: size,
            height: size,
            marginLeft: size && size / 4,
            marginRight: size && size / 4
          }}
          onClick={ () => this.onRoutingModeClick(valueKey) }
        >
          { routingModeIcons[valueKey] }
        </IconButton>
      );
    });
  }

  /**
   * Event handler for selecting the air quality routing mode
   * 
   * @param key clicked button identifier key
   */
   private onRoutingModeClick = (key: keyof RoutingModeIcons) => {
    const { selectedRoutingMode, routeAltStrict, routeAltEfficient, routeAltRelaxed } = this.state;
    
    if (selectedRoutingMode?.name === key) {
      this.onRouteOptionSelected(key);
      return;
    }

    let routeData: RouteData | undefined;
    switch (key) {
      case "Strict":
        routeData = routeAltStrict;
        break;
      case "Efficient":
        routeData = routeAltEfficient;
        break;
      case "Relaxed":
        routeData = routeAltRelaxed;
        break;
    }

    this.setState({
      selectedRoutingMode: {
        name: key,
        associatedRouteData: routeData
      },
      routeTotalExposures: []
    });
  }

  /**
   * Displays already saved route
   * 
   * @param routeToDisplay route to display
   */
  private displaySavedRoute = (routeToDisplay: Route) => {
    const route = PolyUtil.decode(routeToDisplay.routePoints);
    const firstRoutePoint = route[0];
    const lastRoutePoint = route[ route.length - 1 ];

    const locationFromCoordinates = new LatLng(firstRoutePoint[0], firstRoutePoint[1]);
    const locationFrom = { coordinates: locationFromCoordinates, name: routeToDisplay.locationFromName };
    
    const locationToCoordinates = new LatLng(lastRoutePoint[0], lastRoutePoint[1]);
    const locationTo = { coordinates: locationToCoordinates, name: routeToDisplay.locationToName };
    
    const newState = {
      route, 
      locationFrom, 
      locationTo, 
      locationFromTextInput: routeToDisplay.locationFromName, 
      locationToTextInput: routeToDisplay.locationToName,
      mapViewport: { center: [ firstRoutePoint[0], firstRoutePoint[1] ] as [number, number], zoom: 13 }
    }
    this.setState(newState);
  }

  /**
   * Displays already saved location
   * 
   * @param locationToDisplay location to display
   */
  private displayFavouriteLocation = (locationToDisplay: FavouriteLocation) => {
    if (!locationToDisplay) {
      return;
    }

    const coordinates = new LatLng(locationToDisplay.latitude, locationToDisplay.longitude);
    const locationObject = { name: locationToDisplay.name, coordinates };
    this.setState({
      mapViewport: {
        center: [locationToDisplay.latitude, locationToDisplay.longitude],
        zoom: 15
      },
      selectedFavouriteLocation: locationObject
    });
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
      const user = await userSettingsApi.getUser({userId: accessToken.userId || ""});
      const { homeAddress } = user;
      
      if (homeAddress) {
        const { streetAddress, postalCode, city, country } = homeAddress;
        const addressString = `${streetAddress}, ${city}, ${country}, ${postalCode}`;
        const geocodingResponse = await Geocode.fromAddress(addressString, process.env.REACT_APP_GOOGLE_API_KEY);
        
        if (geocodingResponse.length === 1) {
          const { lat, lng } = geocodingResponse.results[0].geometry.location;
          const center = [ Number.parseFloat(lat), Number.parseFloat(lng) ] as [number, number];
          const mapViewport = { center, zoom: 13 }
          this.setState({ mapViewport });
        }
      }
    } catch (error) {}
    this.setState({ loadingUserSettings: false });
  }

  /**
   * Maps favourite locations to locations
   *
   * @param favouriteLocations  users favourite locations 
   */
  private mapLocationsFromFavouriteLocations = (favouriteLocations: FavouriteLocation[]) => {
    return favouriteLocations.map((element) => {
      const name = element.name;
      const coordinates = new LatLng(element.latitude, element.longitude);
      return { name, coordinates } as Location;
    }).slice(
      0,
      NUMBER_OF_RESULTS_FOR_FAVOURITE_PLACES
    );
  }

  /**
   * Filters favourite locations with a specific keyword
   * 
   * @param keyword the string to search
   */
  private searchInFavouriteLocations = (keyword:string) =>{
    const {userFavouriteLocations} = this.state;    
    return userFavouriteLocations.filter((location) =>
          location.name
            .toLowerCase()
            .startsWith(keyword.toLowerCase())
        );
  } 

  /**
   * Adds users saved locations in location from and location in options. 
   */
  private setLocationOptions = () => {
    const { userFavouriteLocations } = this.state;
    const locationToOptions = this.mapLocationsFromFavouriteLocations(userFavouriteLocations);
    const locationFromOptions = locationToOptions
    this.setState({ locationFromOptions, locationToOptions });
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
   * Loads user favourite locations
   */
  private getUserFavouriteLocations = async () => {
    const { accessToken } = this.props;
    
    if (!accessToken) {
      return;
    }

    const locationsApi = Api.getLocationsApi(accessToken);
    const userFavouriteLocations = await locationsApi.listUserFavouriteLocations();

    this.setState({ userFavouriteLocations });
  }

  /**
   * Deletes user favourite location
   *
   * @param locationId location Id string
   */
  private onDeleteUserFavouriteLocation = async (locationId: string) => {
    const { accessToken } = this.props;
    const { userFavouriteLocations } = this.state;
    
    if (!accessToken) {
      return;
    }

    const locationsApi = Api.getLocationsApi(accessToken);
    await locationsApi.deleteUserFavouriteLocation({ favouriteId: locationId });

    this.setState({
      userFavouriteLocations: userFavouriteLocations.filter(userSavedLocation => userSavedLocation.id !== locationId)
    });
  }

  /**
   * Renders the form for routing
   */
  private renderRoutingForm = (): JSX.Element => {
    const { classes, accessToken } = this.props;
    const {
      locationFrom,
      locationTo,
      departureTime,
      locationFromOptions,
      locationToOptions,
      locationFromTextInput,
      locationToTextInput,
      loadingRoute,
      savingRoute,
      route
    } = this.state;

    return (
      <div className={ classes.routingForm }>
        <div className={ classes.inputFieldContainer }>
          <Autocomplete
            filterOptions={ (options) => options }
            onInputChange={ this.onLocationFromChange } 
            inputValue={ locationFromTextInput }
            onChange={ this.onLocationFromSelected } 
            options={ locationFromOptions } 
            getOptionLabel={ (option: Location) => option.name || "" }
            getOptionSelected={ (option, value) => option.name === value.name }
            value={ locationFrom }
            renderInput={ (params) => 
              <div ref={ params.InputProps.ref } className={ classes.autoCompleteInputWrapper }>
                <MyLocation fontSize="small" htmlColor="#FFF" />
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
            getOptionLabel={ (option: Location) => option.name || "" }
            getOptionSelected={ (option, value) => option.name === value.name }
            value={ locationTo } 
            style={{ marginTop: theme.spacing(2) }}
            renderInput={ (params) => 
              <div ref={ params.InputProps.ref } className={ classes.autoCompleteInputWrapper }>
                <LocationOn fontSize="small" htmlColor="#FFF" />
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
          <Box mt={ 4 }>
            <Divider light />
          </Box>
          <Box mt={ 2 }>
            <MuiPickersUtilsProvider utils = { MomentUtils }>
              <KeyboardDatePicker
                todayLabel={ strings.timePicker.today}
                cancelLabel={ strings.timePicker.cancel }
                inputVariant="standard"
                showTodayButton
                className={ classes.keyboardTimePicker }
                fullWidth
                label={ strings.departureDate }
                variant="dialog"
                format="MM.DD.yyyy"
                value = { departureTime }
                onChange = { this.onStartDateChange }
                disableToolbar = { true }
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box mt={ 2 }>
            <MuiPickersUtilsProvider utils = { MomentUtils }>
              <KeyboardTimePicker
                cancelLabel={ strings.timePicker.cancel }
                inputVariant="standard"
                className={ classes.keyboardTimePicker }
                fullWidth
                ampm={ false }
                label={ strings.departureTime }
                variant="dialog"
                keyboardIcon={ <AccessTimeIcon /> }
                value={ departureTime }
                onChange={ this.onStartDateChange }
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
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
              <Search htmlColor="#fff"
              />
            }
          >
            { strings.routes.findRoute }
          </Button>
          { accessToken && route &&
            <Button
              variant="outlined"
              onClick={ this.onSaveRouteClick }
              className={ classes.routingFormButton }
              endIcon={
                savingRoute ?
                <CircularProgress size={ 20 } color="inherit" className={ classes.routingFormLoader } />
                :
                <Save htmlColor="#fff"
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
    const { 
      route,
      locationFrom,
      locationTo,
      selectedFavouriteLocation,
      airQuality,
      mapInteractive,
      locationToTextInput,
      heatmapLayerVisible,
      routeAltStrict,
      routeAltEfficient,
      routeAltRelaxed,
      selectedRoutingMode
    } = this.state;

    var classNames = require('classnames');

    return (
      <Map
        className={
          classNames(classes.mapComponent, routeAltStrict?.lineCoordinates.length && routeAltEfficient?.lineCoordinates.length && routeAltRelaxed?.lineCoordinates.length && classes.markerPopupBottom)
        }
        ref={ this.mapRef }
        zoomControl={ false } 
        ondblclick={ this.addRoutePoint } 
        doubleClickZoom={ false } 
        onViewportChange={ this.onViewportChange }  
        viewport={ this.state.mapViewport }
        scrollWheelZoom={ mapInteractive }
        dragging={ mapInteractive }
        ondragend={ this.updatePollutantControl }
        >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        { route && 
          <Polyline positions={ route.lineCoordinates }/>
        }
        { routeAltStrict && 
          <Polyline
            positions={ routeAltStrict.lineCoordinates }
            color="green"
            lineCap="round"
            lineJoin="bevel"
            weight={ selectedRoutingMode?.name === "Strict" ? 6 : 4 }
            onclick={ () => this.onRouteOptionSelected("Strict") }
          />
        }
        { routeAltEfficient && 
          <Polyline
            positions={ routeAltEfficient.lineCoordinates }
            color="yellow"
            lineCap="round"
            lineJoin="bevel"
            weight={ selectedRoutingMode?.name === "Efficient" ? 6 : 4 }
            onclick={ () => this.onRouteOptionSelected("Efficient") }
          />
        }
        { routeAltRelaxed && 
          <Polyline
            positions={ routeAltRelaxed.lineCoordinates }
            color="red"
            lineCap="round"
            lineJoin="bevel"
            weight={ selectedRoutingMode?.name === "Relaxed" ? 5 : 3 }
            onclick={ () => this.onRouteOptionSelected("Relaxed") }
          />
        }

        { selectedFavouriteLocation?.coordinates &&
          <Marker
            ref={ this.openPopup }
            position={ selectedFavouriteLocation.coordinates }
          >
            <Popup
              onOpen={ this.switchMapInteraction }
              onClose={ this.exitSelectedFavouriteLocation }
              autoPan={ false }
            >
              <h3>
                { selectedFavouriteLocation.name }
              </h3>
              <Button onClick={ this.onSetSourceClick(selectedFavouriteLocation.coordinates, selectedFavouriteLocation.name) }>
                { strings.from }
              </Button>
              <Button onClick={ this.onSetDestinationClick(selectedFavouriteLocation.coordinates, selectedFavouriteLocation.name) }>
                { strings.to }
              </Button>
            </Popup>
          </Marker>
        }

        { locationFrom?.coordinates &&
          <Marker ref={ this.sourceMarkerRef } position={ locationFrom.coordinates } icon={ sourceIcon }>
            <Popup
              onOpen={ this.switchMapInteraction }
              onClose={ this.switchMapInteraction }
              autoPan={ false }
            >
              { this.renderLocationFromPopupContents() }
            </Popup>
          </Marker>
        }

        { locationTo?.coordinates &&
          <Marker position={ locationTo.coordinates } icon={ destinationIcon }>
            { !routeAltStrict || !routeAltEfficient || !routeAltRelaxed &&
              <Popup
                onOpen={ this.switchMapInteraction }
                onClose={ this.switchMapInteraction }
                autoPan={ false }
              >
                <h3>
                  { `${strings.to}:` }
                </h3>
                <p>
                  { locationToTextInput || "" }
                </p>
                <Button onClick={ () => this.onSaveLocationClick(locationTo.coordinates) }>
                  { strings.locations.saveLocation }
                </Button>
              </Popup>
            }
          </Marker>
        }

        { heatmapLayerVisible &&
          <div>
            <HeatmapLayer
              ref={ this.overlayRef } 
              id="heatmap"
              points={ airQuality }
              longitudeExtractor={ (airQualityElement: AirQuality) => airQualityElement.location.longitude }
              latitudeExtractor={ (airQualityElement: AirQuality) => airQualityElement.location.latitude }
              intensityExtractor={ (airQualityElement: AirQuality) => airQualityElement.pollutionValues }
              />
          </div>
        }

        <PollutantControl
          parentMapRef={ this.mapRef }
          parentLayerRef={ this.overlayRef }
          airQuality={ this.state.airQuality }
          pollutantControlMapCenter={ this.state.pollutantControlMapCenter }
          changeHeatmapLayerVisibility={ this.changeHeatmapLayerVisibility }
        />
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
          userInput={ this.renderDialogNameInput } />
    )
  }

  /**
   * Renders save location dialog
   */
  private renderSaveLocationConfirmDialog = () => {
    const { savingLocation } = this.state;
    return (
      <ConfirmDialog 
          title={ strings.locations.saveLocation } 
          positiveButtonText={ strings.common.save } 
          cancelButtonText={ strings.common.cancel } 
          dialogVisible={ savingLocation } 
          onDialogConfirm={ this.onLocationSaveConfirm } 
          onDialogCancel={ this.onLocationSaveCancel }
          userInput={ this.renderDialogNameInput } />
    )
  }

    /**
   * Renders duplicate location dialog
   */
    private renderDuplicateLocationConfirmDialog = () => {
      const { duplicateLocation } = this.state;
      return (
        <WarningDialog 
          title={ "duplicate location" }
          dialogVisible={ !!duplicateLocation } 
          content={ 
            <Typography>
              { duplicateLocation?.name }
            </Typography>
          }
          onClose={ () => this.setState({
            duplicateLocation: undefined
            })
          }
        />
      )
    }

  /**
   * Renders user input field for dialog
   */
  private renderDialogNameInput = () => {
    const { userDialogInput } = this.state;
    return (
      <TextField
        label={ strings.routes.routeNameInput }
        value={ userDialogInput }
        onChange={ this.onDialogNameInputChange }
      />
    )
  }

  /**
   * Renders popup context for location from marker
   * 
   * @returns popup contents
   */
  private renderLocationFromPopupContents = () => {
    const { classes } = this.props;
    const {
      locationFrom,
      locationFromTextInput,
      routeAltStrict,
      routeAltEfficient,
      routeAltRelaxed,
      selectedRoutingMode
    } = this.state;

    if (!locationFrom) {
      return;
    }

    if (routeAltStrict?.lineCoordinates.length && routeAltEfficient?.lineCoordinates.length && routeAltRelaxed?.lineCoordinates.length && selectedRoutingMode) {
      return (
        <div>
          <div className={ classes.markerPopupInfoText }>
            <h4 className={ classes.markerPopupRouteDuration }>
              { selectedRoutingMode.associatedRouteData?.duration || "" }
            </h4>
            <h4 className={ classes.markerPopupRoutePollution }>
              {/* TODO: change to the real route exposure value */}
              { "72pi" }
            </h4>
          </div>
          <div className={ classes.popupRoutingMode }>
            { this.renderRoutingModeSelector(20) }
          </div>
          <h3 className={ classes.markerPopupRoutingModeText }>
            { selectedRoutingMode.name }
          </h3>
        </div>
      );
    }

    return (
      <div>
        <h3>
          { `${strings.from}:` }
        </h3>
        <p>
          { locationFromTextInput || "" }
        </p>
        <Button onClick={ () => this.onSaveLocationClick(locationFrom.coordinates) }>
          { strings.locations.saveLocation }
        </Button>
      </div>
    );
  }

  /**
   * Opens popup when component renders
   *
   * @param marker marker
   */
  private openPopup = (marker: Marker) => {
    if (marker && marker.leafletElement) {
      window.setTimeout(() => {
        marker.leafletElement.openPopup();
      })
    }
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
   * Handles one route option selection action
   * 
   * @param routingMode routing mode 
   */
  private onRouteOptionSelected = (routingMode: RoutingModes) => {
    const { routeAltStrict, routeAltEfficient, routeAltRelaxed } = this.state;

    this.sourceMarkerRef.current?.leafletElement.closePopup();
    
    let polyline = "";
    switch (routingMode) {
      case "Strict":
        this.setState({ route: routeAltStrict });
        polyline = PolyUtil.encode(routeAltStrict) as string;
        break;
      case "Efficient":
        this.setState({ route: routeAltEfficient });
        polyline = PolyUtil.encode(routeAltEfficient) as string;
        break;
      case "Relaxed":
        this.setState({ route: routeAltRelaxed });
        polyline = PolyUtil.encode(routeAltRelaxed) as string;
        break;
    }

    this.setState({
      routeAltStrict: undefined,
      routeAltEfficient: undefined,
      routeAltRelaxed: undefined,
      polyline
    });
  }

  /**
   * Matches pollutant control map center with the main map center
   */
  private updatePollutantControl = () => {
    const { mapViewport } = this.state;

    if (!mapViewport.center) {
      return;
    }

    this.setState({
      pollutantControlMapCenter: mapViewport.center
    });
  }

  /**
   * Changes heatmap layer visibility
   */
  private changeHeatmapLayerVisibility = () => {
    const { heatmapLayerVisible } = this.state;
    
    this.setState({
      heatmapLayerVisible: !heatmapLayerVisible
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
        savingRoute: false,
        userDialogInput: ""
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
  private onDialogNameInputChange = (action: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({
      userDialogInput: action.target.value
    });
  }

  /**
   * Handles save route dialog cancel button click
   */
  private onRouteSaveCancel = () => {
    this.setState({
      savingRoute: false,
      userDialogInput: ""
    });
  }

  /**
   * Handles save location button click
   *
   * @param coordinates coordinates string
   */
  private onSaveLocationClick = (coordinates: LatLng) => {
    this.setState({
      savingLocation: true,
      savingLocationCoordinates: coordinates
    });
  }

  /**
   * Handles save location confirm dialog button click
   */
  private onLocationSaveConfirm = async () => {
    const { accessToken } = this.props;
    const { userDialogInput, userFavouriteLocations, savingLocationCoordinates } = this.state;

    const compareCoordinate = (x: number, y: number) => Math.abs(x - y) <= this.COORDINATE_DELTA;

    const duplicateLocations = userFavouriteLocations.filter(location => (
        compareCoordinate(location.latitude, savingLocationCoordinates!.lat) && 
        compareCoordinate(location.longitude, savingLocationCoordinates!.lng)) 
      );

    if (duplicateLocations.length > 0) {
      const duplicateLocation = duplicateLocations[0];
      this.setState({
        duplicateLocation
      });
      console.log("existing: ", duplicateLocations)
      return;
    }

    if (!accessToken || !userDialogInput || !savingLocationCoordinates) {
      return;
    }

    try {
      const locationsApi = Api.getLocationsApi(accessToken);
      const createdLocation = await locationsApi.createUserFavouriteLocation({
        favouriteLocation: {
          name: userDialogInput,
          latitude: savingLocationCoordinates.lat,
          longitude: savingLocationCoordinates.lng
        }
      });
      this.setState({
        userFavouriteLocations: userFavouriteLocations.concat(createdLocation),
        savingLocationCoordinates: undefined,
        savingLocation: false,
        userDialogInput: ""
      });
    } catch (error) {
      this.setState({
        savingLocation: false,
        error: error
      });
    }
  }

  /**
   * Handles save location dialog cancel button click
   */
  private onLocationSaveCancel = () => {
    this.setState({
      savingLocation: false,
      userDialogInput: ""
    });
  }

  /**
   * Creates a route line offset
   * 
   * @param routeLine the route line as array of points
   * @param offsetDistance coordinates offset distance
   * @returns modified route line
   */
  private routeOffset = (routeLine: LatLng[], offsetDistance: number): LatLng[] => {

    if (!routeLine.length) {
      return [];
    }

    const firstPoint = this.convertPointToCoordinates(routeLine[0]);
    const lastPoint = this.convertPointToCoordinates(routeLine[routeLine.length - 1]);
    const segmentAngle = Math.atan2(firstPoint.lat - lastPoint.lat, firstPoint.lng - lastPoint.lng);
    const offsetAngle = segmentAngle - Math.PI/2;
    return routeLine.map( p => {
      const point = this.convertPointToCoordinates(p);
      let x = point.lng + offsetDistance * Math.cos(offsetAngle);
      let y = point.lat + offsetDistance * Math.sin(offsetAngle);
      return new LatLng(y, x);
    });
  }

  /**
   * Converts point to coordinates
   * 
   * @param point point
   * @returns custom formatted point
   */
  private convertPointToCoordinates = (point: LatLng): PointCoordinates => {
    const pointString = point.toString().split(",");

    return {
      lat: parseFloat(pointString[0]),
      lng: parseFloat(pointString[1])
    }
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
      const locationFromOptions = await (this.nominateCall(locationFromTextInput));
      locationFromOptions.unshift(...this.mapLocationsFromFavouriteLocations(this.searchInFavouriteLocations(locationFromTextInput)));
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
   * Fires when user changes the departure date
   *
   * @param date input date
   */
  private onStartDateChange = (date: MaterialUiPickersDate) => {
    if (!date) {
      return null;
    }

    this.setState({
      departureTime: date.toDate()
    });
  }
  
  /**
   * Calls the api for similar locations and translates it to option format
   *
   * @param keyword the keyword to call the api
   */
  private nominateCall = async (keyword: string): Promise<Location[]> => {
    try {
      const geocodingResponse = await Geocode.fromAddress(keyword, process.env.REACT_APP_GOOGLE_API_KEY);
      return geocodingResponse.results.map((result: any) => {
        const { lat, lng } = result.geometry.location;
        const coordinates = lat + "," + lng;
        const name = result.formatted_address;
        return { name, coordinates };
      });
    }
    catch (error) {
      return error;
    }
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
      const locationToOptions = await (this.nominateCall(locationToTextInput));
      locationToOptions.unshift(...this.mapLocationsFromFavouriteLocations(this.searchInFavouriteLocations(locationToTextInput)));
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
    this.setState({ loadingRoute: true, route: undefined, displayAirQualitySection: true });

    try {
      const { locationTo, locationFrom, mapViewport } = this.state;

      if (! locationFrom || !locationFrom?.coordinates || !locationTo || !locationTo?.coordinates) {
        return;
      }

      const locationFromCoordinates = locationFrom.coordinates;
      const locationToCoordinates = locationTo.coordinates;

      const routeAltStrict = await this.fetchRouteLine("20", "1");
      const routeAltEfficient = await this.fetchRouteLine("8", "1");
      const routeAltRelaxed = await this.fetchRouteLine("1", "1");

      let routeAltOneCoordinates = this.routeOffset(routeAltStrict.lineCoordinates, -0.00003);
      let routeAltTwoCoordinates = this.routeOffset(routeAltEfficient.lineCoordinates, 0);
      let routeAltThreeCoordinates = this.routeOffset(routeAltRelaxed.lineCoordinates, 0.00003);

      routeAltOneCoordinates.unshift(locationFromCoordinates);
      routeAltTwoCoordinates.unshift(locationFromCoordinates);
      routeAltThreeCoordinates.unshift(locationFromCoordinates);

      routeAltOneCoordinates.push(locationToCoordinates);
      routeAltTwoCoordinates.push(locationToCoordinates);
      routeAltThreeCoordinates.push(locationToCoordinates);

      this.sourceMarkerRef.current?.leafletElement.openPopup();

      this.setState({
        routeAltStrict: {
          lineCoordinates: routeAltOneCoordinates,
          duration: routeAltStrict.duration
        },
        routeAltEfficient: {
          lineCoordinates: routeAltTwoCoordinates,
          duration: routeAltEfficient.duration
        },
        routeAltRelaxed: {
          lineCoordinates: routeAltThreeCoordinates,
          duration: routeAltRelaxed.duration
        },
        locationFrom,
        locationTo,
        loadingRoute: false,
        previousZoom: 13,
        mapViewport: { ...mapViewport, center: [locationFromCoordinates.lat, locationFromCoordinates.lng] }
      });

      this.defaultSelectedRoutingMode();
    } catch (error) {
      this.clearRoutingDetails();

      this.setState({
        error: error
      });
    }
  }

  /**
   * Sets default selected routing mode
   */
  private defaultSelectedRoutingMode = () => {
    const { routeAltStrict, routeAltEfficient, routeAltRelaxed } = this.state;
    const defaultMode = process.env.REACT_APP_DEFAULT_ROUTING_MODE || "Strict";

    if (defaultMode === "Strict") {
      this.setState({
        selectedRoutingMode: {
          name: "Strict",
          associatedRouteData: routeAltStrict
        }
      });
    }
    
    if (defaultMode === "Efficient") {
      this.setState({
        selectedRoutingMode: {
          name: "Efficient",
          associatedRouteData: routeAltEfficient
        }
      });
    }

    if (defaultMode === "Relaxed") {
      this.setState({
        selectedRoutingMode: {
          name: "Relaxed",
          associatedRouteData: routeAltRelaxed
        }
      });
    } 
  }
  
  /**
   * Returnes a route line represented by array of coordinates 
   *
   * @param sulfurDioxidePenalty sulfur dioxide penalty
   * @param sulfurDioxideThreshold sulfur dioxide threshold
   * @returns array of coordinates
   */
  private fetchRouteLine = async (sulfurDioxidePenalty: string, sulfurDioxideThreshold: string): Promise<RouteData> => {
    const { locationTo, locationFrom, departureTime } = this.state;

    const routingResponse = await fetch(`${ process.env.REACT_APP_OTP_URL }?fromPlace=${ locationFrom?.coordinates }&toPlace=${ locationTo?.coordinates }&time=${moment(departureTime).format("h:mma")}&date=${moment(departureTime).format("MM-DD-yyyy")}&maxWalkDistance=100000&sulfur_dioxide_threshold=${sulfurDioxideThreshold}&sulfur_dioxide_penalty=${sulfurDioxidePenalty}`);
    const jsonResponse = await routingResponse.json();
    const polyline = jsonResponse.plan.itineraries[0].legs[0].legGeometry.points;
    const duration = new Date(jsonResponse.plan.itineraries[0].duration * 1000).toISOString().substr(11, 5) + strings.units.hours;

    return {
      lineCoordinates: PolyUtil.decode(polyline),
      duration: duration
    };
  }

  /**
   * Updates air quality for route info
   * 
   * @param routePoints route points array
   */
  private updateRouteTotalAirQualityData = async (routePoints: LatLng[]) => {
    const { accessToken } = this.props;
    const { departureTime } = this.state;

    if (!routePoints) {
      return;
    }

    const formattedRoute: string[] = routePoints
      .map(point => {
        return `${point.lat},${point.lng}`;
      });
    const airQualityApi = Api.getAirQualityApi(accessToken);
    const pollutantsApi = Api.getPollutantsApi(accessToken);
    const routeAirQuality = await airQualityApi.getAirQualityForCoordinatesArray({
      requestBody: formattedRoute,
      routingTime: departureTime
    });
    const routePollutionTotals = routeAirQuality.pollutionDataTotals;
    let routeTotalExposures: RouteTotalAirQuality[] = [];
    for (const routePollutionIndex in routePollutionTotals) {
      const pollutionValue = routePollutionTotals[routePollutionIndex].value || 0;
      const providedPollId = routePollutionTotals[routePollutionIndex].pollutantId || "";
      if (providedPollId !== "") {
        const pollutantName = await pollutantsApi.findPollutant({
          pollutantId: providedPollId
        });
        routeTotalExposures.push({
          pollutantName: pollutantName.displayName,
          pollutionValue: pollutionValue
        });
      }
    }

    this.setState({
      routeTotalExposures,
      loadingRouteAirQuality: false
    });
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
    const position = mouseEvent.latlng;
    const location = { name: position.toString(), coordinates: position };
    let geocodingResponse = null;
    if (this.state.editingLocationFrom) {
      const locationFromOptions = [location];
      try {
        geocodingResponse = await Geocode.fromLatLng(mouseEvent.latlng.lat.toString(), mouseEvent.latlng.lng.toString(), process.env.REACT_APP_GOOGLE_API_KEY);
      } catch (e) {
        console.warn("Geocoding error is ", e);
      }

      this.clearRoutingDetails();

      this.setState({
        locationFromOptions,
        locationFrom: location,
        editingLocationFrom: false
      });

      if (geocodingResponse !== null) {
        this.setState({
          locationFromTextInput: geocodingResponse.results[0].formatted_address
        });
      }
    } else {
      try {
        geocodingResponse = await Geocode.fromLatLng(mouseEvent.latlng.lat.toString(), mouseEvent.latlng.lng.toString(), process.env.REACT_APP_GOOGLE_API_KEY);
      } catch (e) {
        console.warn("Geocoding error is ", e);
      }

      this.setState({
        locationTo: location,
        editingLocationFrom: true
      });

      if (geocodingResponse !== null) {
        this.setState({
          locationToTextInput: geocodingResponse.results[0].formatted_address
        });
      }
    }
  }

  /**
   * Clears routing details
   */
  private clearRoutingDetails = () => {

    this.setState({
      locationFrom: undefined,
      locationTo: undefined,
      route: undefined,
      routeAltStrict: undefined,
      routeAltEfficient: undefined,
      routeAltRelaxed: undefined,
      loadingRoute: false,
      routeTotalExposures: [],
      displayAirQualitySection: false
    })
  }

  /**
   * Sets locations name from coordinates
   *
   * @param type GeocodeCoordinate type
   * @param lat lat string
   * @param lon lon string
   */
  private reverseGeocodeCoordinates = async (type: GeocodeCoordinate, lat: string, lon: string) => {
    try {
      const geocodingResponse = await Geocode.fromLatLng(lat, lon, process.env.REACT_APP_GOOGLE_API_KEY);
      const geocodedName = geocodingResponse.results[0].formatted_address || "";
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
    } catch (e) {
      console.warn("Geocoding error is ", e);
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
   * Sets currently displayed location
   *
   * @param location location to display
   */
  private onUserLocationSelect = (location: FavouriteLocation) => {
    this.displayFavouriteLocation(location);
  }

  /**
   * Turns selected favourite location to source location 
   */
  private onSetSourceClick = (coordinates: LatLng, name: string) => () => {
    this.setState({
      locationFrom: {coordinates, name}
    });

    this.reverseGeocodeCoordinates(GeocodeCoordinate.From, coordinates.lat.toString(), coordinates.lng.toString());
    this.exitSelectedFavouriteLocation();
  }

  /**
   * Turns selected favourite location to destination location 
   *
   * @param coordinates coordinates string
   * @param name name string
   */
  private onSetDestinationClick = (coordinates: LatLng, name: string) => () => {
    this.setState({
      locationTo: {coordinates, name}
    });

    this.reverseGeocodeCoordinates(GeocodeCoordinate.To, coordinates.lat.toString(), coordinates.lng.toString());
    this.exitSelectedFavouriteLocation();
  }

  /**
   * Handles Error message clearing
   */
  private onClearError = () => {
    this.setState({
      error: undefined
    });
  }

  /**
   * Hides selected favourite location marker
   */
  private exitSelectedFavouriteLocation = () => {
    this.setState({
      selectedFavouriteLocation: undefined,
      mapInteractive: true
    })
  }

  /**
   * Switches map dragability
   */
  private switchMapInteraction = () => {
    const { mapInteractive } = this.state;
    this.setState({
      mapInteractive: !mapInteractive
    })
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
    displayedRoute: state.displayedRoute.displayedRoute,
    displayedFavouriteLocation: state.displayedFavouriteLocation.displayedFavouriteLocation
  };
}

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
export function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
    setDisplayedRoute: (displayedRoute?: Route) => dispatch(setDisplayedRoute(displayedRoute)),
    setDisplayedFavouriteLocation: (displayedFavouriteLocation?: FavouriteLocation) => dispatch(setDisplayedFavouriteLocation(displayedFavouriteLocation))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapScreen));
