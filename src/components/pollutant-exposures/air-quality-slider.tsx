import React from "react";

import { Typography, withStyles, Slider, Toolbar, ListItem, List, WithStyles } from "@material-ui/core";
import { styles } from "./air-quality-slider.styles";
import strings from "../../localization/strings";
import { RouteTotalAirQuality } from "../../types";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  routeTotalExposures: RouteTotalAirQuality[];
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
    const { routeTotalExposures } = this.props;

    if (routeTotalExposures.length === 0) {
      return <></>;
    }

    var maxPollution = Math.round(Math.max(...routeTotalExposures.flatMap(e => e.pollutionValue)));
    var sliders = this.getSlidersList(maxPollution, routeTotalExposures)
    return (
      <>
        <Toolbar>
          <Typography variant="h2">{ strings.airQuality }</Typography>
        </Toolbar>
        <List>
          { sliders }
        </List>
      </>
      );
  }

  private getSlidersList(maxPollution: number, routeTotalExposures: RouteTotalAirQuality[]) {
    const { classes } = this.props;
    
    return routeTotalExposures.map((d) => (
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
        </ListItem>
        )
      )    
  }
}

function valuetext(value: number) {
  return `${value}°C`;
}

export default withStyles(styles)(AirQualitySlider);
