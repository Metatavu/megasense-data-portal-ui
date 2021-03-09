import { IconButton, Typography } from "@material-ui/core";
import { Paper, withStyles, WithStyles } from "@material-ui/core";
import { MyLocation, Add, Remove } from "@material-ui/icons";
import React from "react";
import {
  Map,
  TileLayer,
} from "react-leaflet";
import strings from "../../localization/strings";
import { styles } from "./polutant-control.styles";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { AirQuality } from "../../generated/client";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  parentMapRef: any;
  parentLayerRef: any;
  airQuality: AirQuality[]
}

/**
 * Interface describing component state
 */
interface State {
  parentMap: any;
  parentLayer: any;
  showPolutantData: boolean;
}

/**
 * PolutantControl component
 */
class PolutantControl extends React.Component<Props, State> {
  mapRef: React.RefObject<Map>;
  
  /**
   * Component constructor
   *
   * @param props props
   */
  constructor(props: Props) {

    super(props);

    this.state = {
      parentMap: props.parentMapRef,
      parentLayer: props.parentLayerRef,
      showPolutantData: false,

    };
    this.mapRef = React.createRef();
    this.findMe = this.findMe.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.toggleMap = this.toggleMap.bind(this);
  }

  /**
   * Change the location of the map to the current location of user.
   */
  findMe() {

    this.state.parentMap.current?.leafletElement.locate({ setView: true, maxZoom: 16 });
    this.mapRef.current?.leafletElement.locate({ setView: true, maxZoom: 16 });
  }

  /**
   * Zoom in the map
   */
  zoomIn() {
    this.state.parentMap.current?.leafletElement.zoomIn(1)
  }
  
  /**
   * Zoom out the map
   */
  zoomOut() {
    this.state.parentMap.current?.leafletElement.zoomOut(1)
  }
  
  /**
   * toggle the layer status value and toggles data layer
   */
  toggleMap() {
    const { showPolutantData } = this.state
    this.setState({ showPolutantData: !showPolutantData })
    this.toggleLayer(!showPolutantData)

  }

  /**
   * Component constructor
   *
   * @param showPolutantData boolean
   */
  toggleLayer(showPolutantData: boolean) {
    const map = this.state.parentMap.current?.leafletElement;
    const layer = this.state.parentLayer.current?.leafletElement;
    showPolutantData ? map.addLayer(layer) : map.removeLayer(layer);
  }

  /**
   * PolutantControl render method
   */
  render(): JSX.Element {
    const { classes } = this.props;
    const { showPolutantData } = this.state;
    return (
      <div id="layercontrol" className={"leaflet-bottom leaflet-left"}>
        <div className={classes.buttonholder}>
          <IconButton className={classes.button}
            size="medium"
            title={strings.map.zoomIn}
            onClick={this.zoomIn}
          >
            <Add />
          </IconButton>
          <IconButton className={classes.button}
            size="medium"
            title={strings.map.zoomOut}
            onClick={this.zoomOut}
          >
            <Remove />
          </IconButton>
          <IconButton className={classes.button}
            size="medium"
            title={strings.map.myLocation}
            onClick={this.findMe}
          >
            <MyLocation />
          </IconButton>

        </div>
        <Paper className={classes.mapContainer}>

          <Typography variant="h2" color="primary" className={classes.toggleMap} onClick={this.toggleMap}
          >          {showPolutantData ? strings.map.showMap : strings.map.showDataOverlay} </Typography>

          {this.state.parentMap.current &&

            <Map
              className={classes.smallMap}
              center={this.state.parentMap.current?.leafletElement.getCenter()}
              zoom={8}
              dragging={true}
              doubleClickZoom={true}
              scrollWheelZoom={true}
              attributionControl={false}
              zoomControl={false}

            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {!showPolutantData &&
                <HeatmapLayer
                  points={this.props.airQuality}
                  longitudeExtractor={(airQuality: AirQuality) => airQuality.location.longitude}
                  latitudeExtractor={(airQuality: AirQuality) => airQuality.location.latitude}
                  intensityExtractor={(airQuality: AirQuality) => airQuality.pollutionValue}
                />
              }
            </Map>

          }
        </Paper>

      </div>
    );
  }
}

export default withStyles(styles)(PolutantControl);
