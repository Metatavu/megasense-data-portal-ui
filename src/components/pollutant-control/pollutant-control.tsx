import { IconButton, Paper, withStyles, WithStyles, Button } from "@material-ui/core";
import { MyLocation, Add, Remove } from "@material-ui/icons";
import React from "react";
import { Map, TileLayer } from "react-leaflet";
import strings from "../../localization/strings";
import { styles } from "./pollutant-control.styles";
import { AirQuality } from "../../generated/client";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  parentMapRef: any;
  parentLayerRef: any;
  airQuality: AirQuality[];
  pollutantControlMapCenter?: [number, number];
  changeHeatmapLayerVisibility: () => void;
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
    const { classes, pollutantControlMapCenter } = this.props;
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
          { this.props.parentMapRef.current &&
            <Map
              className={ classes.smallMap }
              center={ pollutantControlMapCenter }
              zoom={ 8 }
              dragging={ true }
              doubleClickZoom={ false }
              scrollWheelZoom={ false }
              attributionControl={ false }
              zoomControl={ false }
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </Map>
          }
          <Button
            variant="text"
            disableElevation
            autoFocus
            onClick={ this.toggleMap }
            className={ classes.toggleMap }
          >
            { showPollutantData ? strings.map.showMap : strings.map.showDataOverlay }
          </Button>
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
   * Toggle the layer status value and toggles data layer
   */
  private toggleMap = () => {
    const { showPollutantData } = this.state;
    this.setState({ showPollutantData: !showPollutantData });
    this.props.changeHeatmapLayerVisibility();
  }
}

export default withStyles(styles)(PollutantControl);
