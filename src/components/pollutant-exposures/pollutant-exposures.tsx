import { IconButton, Typography, Paper, withStyles, WithStyles, Slider, Box, Toolbar, Dialog, Button } from "@material-ui/core";
import { MyLocation, Add, Remove, PeopleTwoTone } from "@material-ui/icons";
import React from "react";
import { Map, TileLayer } from "react-leaflet";
import strings from "../../localization/strings";
import { AirQuality } from "../../generated/client";
import { styles } from "./pollutant-exposures.styles";
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

/**
 * PollutantControl component
 */
class PollutantExposures extends React.Component<Props, State> {


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
   * PollutantControl render method
   */
  public render = () => {
    const { classes, routeTotalExposures } = this.props;
    console.log("printing all "+routeTotalExposures)

    const pollutantsList = routeTotalExposures.map((d) => 
    <>
    <Toolbar>
        <Typography id="discrete-slider-custom" gutterBottom>
          { d.pollutantName }
        </Typography>
        <Slider className={ classes.slider }
          defaultValue={ d.pollutionValue }
          getAriaValueText= { valuetext }
          aria-labelledby="continuous-slider"
          min={0}
          max={10000}
          valueLabelDisplay="auto"
        />
        </Toolbar>
    </>
    );
    return (
        pollutantsList
      );
  }

}

function valuetext(value: number) {
  return `${value}°C`;
}
export default withStyles(styles)(PollutantExposures);
