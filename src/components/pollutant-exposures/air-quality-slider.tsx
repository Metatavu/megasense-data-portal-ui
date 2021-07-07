import React from "react";

import { Typography, withStyles, Slider, Toolbar, ListItem, List, WithStyles, CircularProgress } from "@material-ui/core";
import { styles } from "./air-quality-slider.styles";
import strings from "../../localization/strings";
import { RouteTotalAirQuality } from "../../types";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  routeTotalExposures: RouteTotalAirQuality[];
  displayRouteAirQuality: boolean;
  loadingRouteAirQuality: boolean;
}

/**
 * Interface describing component state
 */
interface State {}

/**
 * Component which displays air quality per pollutant in sliders list
 */
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
    const { classes, routeTotalExposures, loadingRouteAirQuality, displayRouteAirQuality } = this.props;

    if (!displayRouteAirQuality) {
      return null;
    }
    
    const sliders = this.getSlidersList(routeTotalExposures)
    
    return (
      <>
        <Toolbar>
          <Typography variant="h2">{ strings.airQuality }</Typography>
        </Toolbar>
        { loadingRouteAirQuality ?
          <CircularProgress size={ 40 } color="inherit" className={ classes.airQualityDataLoader } /> :
          <List>
            { sliders }
          </List>
        }
      </>
      );
  }

  /**
   * Builds list of ListItems for pollutants exposure data
   * 
   * @param routeTotalExposures air quality total data for different pollutants for the route
   * @returns list of sliders 
   */
  private getSlidersList(routeTotalExposures: RouteTotalAirQuality[]) {
    const { classes } = this.props;
    const maxPollution = Math.round(Math.max(...routeTotalExposures.flatMap(e => e.pollutionValue)));

    return routeTotalExposures.map((pollutantData) => (
        <ListItem>
          <Typography id="discrete-slider-custom" gutterBottom>
            { pollutantData.pollutantName }
          </Typography>
          <Slider 
            className={ classes.slider }
            value={ Math.round(pollutantData.pollutionValue) }
            getAriaValueText= { value => `${value}°C` }
            aria-labelledby="continuous-slider"
            min={0}
            max={ maxPollution }
            disabled
            valueLabelDisplay="on"
          />
        </ListItem>
        )
      )    
  }
}

export default withStyles(styles)(AirQualitySlider);
