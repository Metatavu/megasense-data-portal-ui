import Container from '@material-ui/core/Container';
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "../../../actions";
import strings from "../../../localization/strings";
import { AccessToken, StoreState } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';

/**
 * Interface describing component props
 */
interface Props {
  accessToken?: AccessToken;
}

/**
 * Interface describing component state
 */
interface State {
  visibleTimeDialog: boolean,
  visiblePollutionDialog: boolean,
  timeValue: string,
  pollutantValue: string,
  DisplayPollutantButton: boolean,
  DisplayAllData: boolean,
  DisplayResetButton: boolean
  DisplaySinglePollutionData: boolean
}

/**
 * Component for warehouses screen
 */
class SavedRoutes extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      visibleTimeDialog: false,
      visiblePollutionDialog: false,
      DisplayAllData: true,
      DisplayPollutantButton: false,
      DisplayResetButton: false,
      DisplaySinglePollutionData: false,
      pollutantValue: "",
      timeValue: ""
    };
  }

  /**
   * Component render method
   */
  render() {

    return (
      <AppLayout>
        <Container>
          <Typography variant="h3" component="h1">
            Statistics
          </Typography>
          <Button variant="contained" color="primary" onClick={() => this.DisplayTimeDialog()}>
            Select time range
          </Button>
          { this.DisplayPollutantButton() }
          { this.DisplayAllData() }
          { this.DisplaySinglePollution() }
          <Dialog
            open={ this.state.visibleTimeDialog }
            onClose={() => this.DisplayTimeDialog()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Select time"}</DialogTitle>
            <DialogContent>
              <FormControl component="fieldset">
              <FormLabel component="legend">{ strings.displayTables }</FormLabel>
                <RadioGroup name="timeValue" value={ this.state.timeValue } onChange={ this.handleTimeChange }>
                  <FormControlLabel value="weekly" control={<Radio />} label={ strings.weeklyExposure } />
                  <FormControlLabel value="monthly" control={<Radio />} label={ strings.monthlyExposure } />
                  <FormControlLabel value="annual" control={<Radio />} label={ strings.annualExposure } />
                </RadioGroup>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.CloseTimeDialog()} color="primary" autoFocus>
                { strings.confirmTimeRange }
              </Button>
              <Button onClick={() => this.DisplayTimeDialog()} color="primary">
                { strings.cancel }
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={ this.state.visiblePollutionDialog }
            onClose={() => this.DisplayPollutionDialog()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
              <FormControl component="fieldset">
                <FormLabel component="legend">{ strings.displayTables }</FormLabel>
                <RadioGroup aria-label="Select pollutant" name="pollution" value={ this.state.pollutantValue } onChange={ this.handlePollutantChange }>
                  <FormControlLabel value="PM25" control={<Radio />} label={ strings.pollutantPM25 } />
                  <FormControlLabel value="PM10" control={<Radio />} label= { strings.pollutantPM25 }/>
                  <FormControlLabel value="ozone" control={<Radio />} label={ strings.pollutantOzone } />
                  <FormControlLabel value="nitrogen" control={<Radio />} label={ strings.pollutantNitrogen } />
                  <FormControlLabel value="sulfur" control={<Radio />} label={ strings.pollutanSulfur } />
                </RadioGroup>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.ClosePollutionDialog()} color="primary" autoFocus>
                { strings.selectPollution }
              </Button>
              <Button onClick={() => this.DisplayPollutionDialog()} color="primary">
                { strings.cancel }
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </AppLayout>
    );
  }

  /**
   * Displays time dialog
   */
  private DisplayTimeDialog = () => {
    this.setState({
      visibleTimeDialog: this.state.visibleTimeDialog ? false : true,
    })
  }

  /**
   * Close time dialog and makes pollution button visible
   */
  private CloseTimeDialog() {
    if (this.state.timeValue.length > 0) {
      this.setState({
        visibleTimeDialog: false,
        DisplayPollutantButton: true,
        DisplayAllData: true
      })
    }
  }
  
  /**
   * Displays pollution dialog
   */
  private DisplayPollutionDialog = () => {
    this.setState({
      visiblePollutionDialog: this.state.visiblePollutionDialog ? false : true
    })
  }

  /**
   * Event that handles radio button value changes in the time dialog
   */
  private handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      timeValue: event.target.value,
    })
  }

  /**
   * Event that handles radio button value changes in the pollution dialog
   */
  private handlePollutantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    this.setState({
      pollutantValue: event.target.value,
    })
  }

  /**
   * Displays pollution button
   */
  private DisplayPollutantButton = () => {
    if (this.state.DisplayPollutantButton) {
      return (
        <>
          <Button variant="contained" color="secondary" onClick={() => this.DisplayPollutionDialog()}>
            { strings.selectPollution }
          </Button>
          <Button variant="contained" color="default" onClick={() => this.reset()}>
            { strings.reset }
          </Button>
        </>
      )
    }
  }

  /**
   * Displays all data related to selected time range
   */
  private DisplayAllData = () => {
    if (this.state.DisplayAllData) {
      switch (this.state.timeValue) {
        case "weekly": {
          return (
            <>
              <Typography variant="h4" component="h4">
                { strings.weeklyExposure }
              </Typography>
            </>
          );
        }
        case "monthly": {
          return (
            <>
              <Typography variant="h4" component="h4">
                {strings.monthlyExposure}
              </Typography>
            </>
          )
        }
        case "annual": {
          return (
            <>
              <Typography variant="h4" component="h4">
                { strings.annualExposure }
              </Typography>
            </>
          )
        }
        default: {
          //statements; 
          break;
        }
      }
    }
  }

  /**
   * Closes pollution dialog and hides all which are related to time 
   */
  private ClosePollutionDialog = () => {
    if (this.state.pollutantValue.length > 0) {
      this.setState({
        visiblePollutionDialog: false,
        DisplayAllData: false,
        DisplaySinglePollutionData: true
      })
    }
  }

  /**
   * Resrets values
   */
  private reset = () => {
    this.setState({
      visibleTimeDialog: false,
      visiblePollutionDialog: false,
      DisplayAllData: true,
      DisplayPollutantButton: false,
      DisplayResetButton: false,
      DisplaySinglePollutionData: false,
      pollutantValue: "",
      timeValue: ""
    })
  }

  /**
   * Displays single pollution data with user chosen time value
   */
  private DisplaySinglePollution = () => {
    if (this.state.DisplaySinglePollutionData) {
      if (this.state.timeValue === "weekly") {
        switch (this.state.pollutantValue) {
          case "PM25": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.weeklyExposure }: { strings.pollutantPM25 }
                </Typography>
              </>
            )
          }
          case "PM10": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.weeklyExposure }: { strings.pollutantPM10 }
                </Typography>
              </>
            )
          }
          case "ozone": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.weeklyExposure }: { strings.pollutantOzone }
                </Typography>
              </>
            );
          }
          case "nitrogen": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.weeklyExposure }: { strings.pollutantNitrogen }
                </Typography>
              </>
            );
          }
          case "sulfur": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.weeklyExposure }: { strings.pollutanSulfur }
                </Typography>
              </>
            );
          }
          default: {
            //statements; 
            break;
          }
        }
      }
      if (this.state.timeValue === "monthly") {
        switch (this.state.pollutantValue) {
          case "PM25": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.monthlyExposure }: { strings.pollutantPM25 }
                </Typography>
              </>
            );
          }
          case "PM10": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.monthlyExposure }: { strings.pollutantPM10 }
                </Typography>
              </>
            );
          }
          case "ozone": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.monthlyExposure }: { strings.pollutantOzone }
                </Typography>
              </>
            );
          }
          case "nitrogen": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.monthlyExposure }: { strings.pollutantNitrogen }
                </Typography>
              </>
            );
          }
          case "sulfur": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.monthlyExposure }: { strings.pollutanSulfur }
                </Typography>
              </>
            );
          }
          default: {
            //statements; 
            break;
          }
        }
      }
      if (this.state.timeValue === "annually") {
        switch (this.state.pollutantValue) {
          case "PM25": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.annualExposure }: { strings.pollutantPM25 }
                </Typography>
              </>
            );
          }
          case "PM10": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.annualExposure }: { strings.pollutantPM10 }
                </Typography>
              </>
            );
          }
          case "ozone": {
            return (
              <>
                <Typography variant="h4" component="h4">
                  { strings.annualExposure }: { strings.pollutantOzone }
                </Typography>
              </>
            );
          }
          case "nitrogen": {
            return (
              <>
                <Typography variant="subtitle1" component="p">
                  { strings.annualExposure }: { strings.pollutantNitrogen }
                </Typography>
              </>
            );
          }
          case "sulfur": {
            return (
              <>
                <Typography variant="subtitle1" component="p">
                  { strings.annualExposure }: { strings.pollutanSulfur }
                </Typography>
              </>
            );
          }
          default: {
            //statements; 
            break;
          }
        }
      }
    }
  }
}

/**
 * Redux mapper for mapping store state to component props
 * @param state store state
 */
export function mapStateToProps(state: StoreState) {
  return {
    accessToken: state.accessToken
  };
}

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedRoutes);
