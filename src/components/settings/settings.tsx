import React from "react";
import { AppBar, Box, Button, IconButton, Toolbar, Typography, withStyles, WithStyles, Checkbox, Slider, FormGroup, FormControlLabel, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import { styles } from "./settings.styles";
import CloseIcon from "@material-ui/icons/Close";
import strings from "../../localization/strings";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TimerIcon from '@material-ui/icons/Timer';
import EcoIcon from '@material-ui/icons/Eco';
import LogoIcon from "../../resources/svg/logo-icon";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  onSettingsCloseClick: () => void;
}

/**
 * Interface describing component state
 */
interface State {
  settingsOpen: boolean;
}

/**
 * Component for settings
 */
class Settings extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = {
      settingsOpen: false
    };
  }

  /**
   * Settings render method
   */
  public render = () => {
    const { onSettingsCloseClick } = this.props;

    return (
      <>
        <AppBar position="relative">
          <Toolbar>
            <Box 
              display="flex"
              flex="1"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5">{ strings.settings.title }</Typography>
              <Box>
                <Button
                  disabled={ true }
                  color="inherit"
                  variant="text"
                >
                  { strings.common.save }
                </Button>
                <IconButton
                  color="inherit"
                  onClick={ onSettingsCloseClick }
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        { this.renderAccordionMenu() }
      </>
    );
  }

  /**
   * Method for rendering settings accordion menu
   */
  private renderAccordionMenu() {

    return (
      <Box p={ 3 }>
        { this.renderAccordionMenuTransportation() }
        { this.renderAccordionMenuMedical() }
        { this.renderAccordionMenuCustom() }
      </Box>
    );
  }

  /**
   * Method for rendering transportation accordion menu item
   */
  private renderAccordionMenuTransportation = () => {
    return (
      <Accordion defaultExpanded={ true }>
        <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
          <Typography>{ strings.settingsDrawer.transportation }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{ strings.settingsDrawer.descriptionTransportation }</Typography>
          <FormGroup>
            { this.menuCheckbox(strings.walking) }
            { this.menuCheckbox(strings.wheelerchair) }
            { this.menuCheckbox(strings.walking) }
            { this.menuCheckbox(strings.wheelerchair) }
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    );
  }

  /**
   * Method for medical accordion menu item
   */
  private accordionMenuMedical = () => {
    return (
      <Accordion defaultExpanded={ true }>
        <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
          <Typography>{ strings.settingsDrawer.medical }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{ strings.settingsDrawer.descriptionMedical }</Typography>
          <FormGroup>
            { this.menuCheckbox(strings.medicalConditions.asthma) }
            { this.menuCheckbox(strings.medicalConditions.ischaemicHeartDisease) }
            { this.menuCheckbox(strings.medicalConditions.copd) }
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    );
  }

  /**
   * Method for rendering checkbox
   *
   * @param label checkbox label string
   */
  private menuCheckbox = (label: string) => {

    return (
      <FormControlLabel
        control={ <Checkbox color="primary" /> }
        label={ label }  
        labelPlacement= "start"
      />
    );
  }

  /**
   * Method for medical accordion menu item
   */
  private accordionMenuCustom = () => {
    return (
      <Accordion>
        <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
          <Typography>{ strings.settingsDrawer.custom }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{ strings.settingsDrawer.descriptionCustom }</Typography>
          { this.renderPollutantSlider(strings.pollutants.carbonMonoxide) }
          { this.renderPollutantSlider(strings.pollutants.ozone) }
          { this.renderPollutantSlider(strings.pollutants.sulfurOxide) }
          { this.renderPollutantSlider(strings.pollutants.nitrogenOxide) }
          { this.renderPollutantSlider(strings.pollutants.PM10) }
          { this.renderPollutantSlider(strings.pollutants.PM25) }
          <Button
            color="primary"
            variant="contained"
            fullWidth={ true }
          >
            { strings.common.save }
          </Button>
        </AccordionDetails>
      </Accordion>
    );
  }

  /**
   * Method for rendering pollutant slider
   *
   * @param label slider label string
   */
  private renderPollutantSlider = (label: string) => {
    const marks = [
      {
        value: 0,
        label: <TimerIcon color="primary" />,
      },
      {
        value: 50,
        label: <LogoIcon color="primary" />,
      },
      {
        value: 100,
        label: <EcoIcon color="primary" />,
      },
    ];
  
    return (
      <Box>
        <Typography>
          { label }
        </Typography>
        <Slider
          defaultValue={ 50 }
          step={ 50 }
          valueLabelDisplay="off"
          marks={ marks }
          track={ false }
        />
      </Box>
    );
  }

}

export default withStyles(styles)(Settings);
