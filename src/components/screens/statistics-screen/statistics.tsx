import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "../../../actions";
import strings from "../../../localization/strings";
import { AccessToken, StoreState } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { Container, FormControl, Typography, Grid, Card, Select, InputLabel, TextField, Box, List, ListItem} from '@material-ui/core';
import DrawerMenu from "../../generic/drawer-menu/drawer-menu";
import { styles } from "./statistics.styles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
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
  public render = () => {
    const { classes } = this.props
    /**
     * Components to display in the drawer
     */
    const statisticsComponent = (
      <>
        <Box mt={ 10 }>
          <List>
            <ListItem>
              <FormControl className={classes.formControl}>
                <TextField
                  id="date"
                  label="Select time"
                  type="date"
                  defaultValue="10.10.2020"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControl variant="outlined" className={ classes.formControl }>
                <InputLabel htmlFor="outlined-age-native-simple">Select pollution</InputLabel>
                <Select
                  native
                  fullWidth
                  label="Select time range"
                  inputProps={{
                    name: 'time',
                    id: 'outlined-age-native-simple',
                  }}
                >
                  <option aria-label="None" value="" />
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Annual</option>
                </Select>
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControl variant="outlined" className={ classes.formControl }>
                <InputLabel htmlFor="outlined-age-native-simple">{ strings.selectPollution }</InputLabel>
                <Select
                  native
                  fullWidth
                  label="Select pollution"
                  inputProps={{
                    name: 'age',
                    id: 'outlined-age-native-simple',
                  }}
                >
                  <option aria-label="None" value="" />
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Annual</option>
                </Select>
              </FormControl>
            </ListItem>
          </List>
        </Box>
      </>
    );
    return (
      <AppLayout>
        <DrawerMenu open= { true } statisticsControls={ statisticsComponent } />
        <Container>
          <Grid container spacing = { 3 }>
            <Grid item xs={ 12 }>
              <Card>
                <Typography variant="h3">
                  { strings.statistics }
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </AppLayout>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SavedRoutes));
