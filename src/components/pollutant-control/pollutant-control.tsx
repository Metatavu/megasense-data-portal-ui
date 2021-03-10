import { IconButton, Typography, Paper, withStyles, WithStyles } from "@material-ui/core";
import { MyLocation, Add, Remove } from "@material-ui/icons";
import React from "react";
import { Map, TileLayer } from "react-leaflet";
import strings from "../../localization/strings";
import { styles } from "./pollutant-control.styles";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { AirQuality } from "../../generated/client";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  parentMapRef: any;
  parentLayerRef: any;
  airQuality: AirQuality[];
}

/**
 * Interface describing component state
 */
interface State {
  showPollutantData: boolean;
}

/**
 * PollutantControl component
 */
class PollutantControl extends React.Component<Props, State> {
  mapRef: React.RefObject<Map>;

  /**
   * Component constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      showPollutantData: false,
    };
    this.mapRef = React.createRef();
  }

  /**
   * PollutantControl render method
   */
  public render = () => {
    const { classes } = this.props;
    const { showPollutantData } = this.state;
    
    return (
      <div id="layercontrol" className={ "leaflet-bottom leaflet-left" }>
        <div className={ classes.buttonholder }>
          <IconButton className={ classes.button }
            size="medium"
            title={ strings.map.zoomIn }
            onClick={ this.zoomIn }
          >
            <Add />
          </IconButton>
          <IconButton className={ classes.button }
            size="medium"
            title={ strings.map.zoomOut }
            onClick={ this.zoomOut }
          >
            <Remove />
          </IconButton>
          <IconButton className={ classes.button }
            size="medium"
            title={ strings.map.myLocation }
            onClick={ this.findMe }
          >
            <MyLocation />
          </IconButton>
        </div>
        <Paper className={ classes.mapContainer }>
          <Typography
            variant="h2"
            color="primary"
            className={ classes.toggleMap }
            onClick={ this.toggleMap }
          >
            { showPollutantData ? strings.map.showMap : strings.map.showDataOverlay }
          </Typography>
          { this.props.parentMapRef.current &&
            <Map
              className={ classes.smallMap }
              center={ this.props.parentMapRef.current?.leafletElement.getCenter() }
              zoom={ 8 }
              dragging={ true }
              doubleClickZoom={ true }
              scrollWheelZoom={ true }
              attributionControl={ false }
              zoomControl={ false }
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              { !showPollutantData &&
                <HeatmapLayer
                  points={ this.props.airQuality }
                  longitudeExtractor={ (airQuality: AirQuality) => airQuality.location.longitude }
                  latitudeExtractor={ (airQuality: AirQuality) => airQuality.location.latitude }
                  intensityExtractor={ (airQuality: AirQuality) => airQuality.pollutionValue }
                />
              }
            </Map>
          }
        </Paper>
      </div>
    );
  }

  /**
   * Change the location of the map to the current location of user.
   */
  private findMe = () => {
    const { parentMapRef } = this.props;
    parentMapRef.current?.leafletElement.locate({ setView: true, maxZoom: 16 });
    this.mapRef.current?.leafletElement.locate({ setView: true, maxZoom: 16 });
  }

  /**
   * Zoom in the map
   */
  private zoomIn = () => {
    const { parentMapRef } = this.props;
    parentMapRef.current?.leafletElement.zoomIn(1);
  }

  /**
   * Zoom out the map
   */
  private zoomOut = () => {
    const { parentMapRef } = this.props;
    parentMapRef.current?.leafletElement.zoomOut(1);
  }

  /**
   * toggle the layer status value and toggles data layer
   */
  private toggleMap = () => {
    const { showPollutantData } = this.state;
    this.setState({ showPollutantData: !showPollutantData });
    this.toggleLayer(!showPollutantData);
  }

  /**
   * Component constructor
   *
   * @param showPollutantData boolean
   */
  private toggleLayer = (showPollutantData: boolean) => {
    const { parentMapRef, parentLayerRef } = this.props;
    const map = parentMapRef.current?.leafletElement;
    const layer = parentLayerRef.current?.leafletElement;
    showPollutantData ? map.addLayer(layer) : map.removeLayer(layer);
  }
}

export default withStyles(styles)(PollutantControl);
