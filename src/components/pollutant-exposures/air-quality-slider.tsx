import { IconButton, Typography, Paper, withStyles, Slider, Box, Toolbar, Dialog, Button, ListItem, List, WithStyles } from "@material-ui/core";
import { MyLocation, Add, Remove, PeopleTwoTone } from "@material-ui/icons";
import React from "react";
import { Map, TileLayer } from "react-leaflet";
import strings from "../../localization/strings";
import { AirQuality } from "../../generated/client";
import { styles } from "./air-quality-slider.styles";
import { Pollutant } from '../../generated/client/models/Pollutant';
import { PollutionEntry } from '../../generated/client/models/PollutionEntry';
import { RouteAirQuality } from '../../generated/client/models/RouteAirQuality';
import RouteTotalExposure from "./route-total-exposure";



/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  routeTotalExposures: RouteTotalExposure[];
}

/**
 * Interface describing component state
 */
interface State {
}


class AirQualitySlider extends React.Component<Props, State> {


  /**
   * Component constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  
  /**
   * Render method to display air quality for route sliders
   */
  public render = () => {
    const { classes, routeTotalExposures } = this.props;
    if (routeTotalExposures.length === 0) {
      return <></>
    }
    var maxPollution = 0;
    for (var pollutantExposure in routeTotalExposures) {
      if (routeTotalExposures[pollutantExposure].pollutionValue > maxPollution) {
        maxPollution = Math.round(routeTotalExposures[pollutantExposure].pollutionValue)
      }
    }
    
    return (
      <>
        <Toolbar>
          <Typography variant="h2">Air quality</Typography>
        </Toolbar>
        <List>
          { routeTotalExposures.map((d) => (
          <ListItem>
            <Typography id="discrete-slider-custom" gutterBottom>
              { d.pollutantName }
            </Typography>
            <Slider className={ classes.slider }
              value={ Math.round(d.pollutionValue) }
              getAriaValueText= { valuetext }
              aria-labelledby="continuous-slider"
              min={0}
              max={ maxPollution }
              disabled
              valueLabelDisplay="on"
              />
          </ListItem>)
          )
        }
        </List>
      </>
      );
  }
}

function valuetext(value: number) {
  return `${value}°C`;
}
export default withStyles(styles)(AirQualitySlider);
