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
import Api from "../../../api";
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, Legend, YAxis } from 'recharts';
import { ExposureInstance } from "../../../generated/client";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  accessToken?: AccessToken;
}
interface exposureData {
  id?: string;
  harmfulMicroparticles?: number;
  nitrogenDioxide?: number;
  nitrogenMonoxide?: number;
  ozone?: number;
  routeId: any;
  startedAt?: string;
  endedAt?: string;
  sulfurDioxide?: number;
}
/**
 * Interface describing component state
 */
interface State {
  visibleTimeDialog: boolean;
  visiblePollutionDialog: boolean;
  timeValue: string;
  pollutantValue: string;
  DisplayPollutantButton: boolean;
  DisplayAllData: boolean;
  DisplayResetButton: boolean;
  DisplaySinglePollutionData: boolean;
  statisticsData: ExposureInstance[];
  exposureData: exposureData[];
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
      timeValue: "",
      statisticsData: [],
      exposureData: []
    };
  }
  
  /**
   * Component life cycle method
   */
  public componentDidMount = async () => {
    await this.getData();
    let exposureData: exposureData[] = [];
    for (let i = 0; i < this.state.statisticsData.length; i++) {
      const data = this.state.statisticsData[i];
      exposureData.push ({
        "id": data.id,
        harmfulMicroparticles: data.harmfulMicroparticles,
        nitrogenDioxide: data.nitrogenDioxide,
        nitrogenMonoxide: data.nitrogenMonoxide,
        ozone: data.ozone,
        routeId: data.routeId,
        startedAt: data.startedAt?.getDate() + "." + data.startedAt?.getMonth() + "." + data.startedAt?.getFullYear(),
        endedAt: data.endedAt?.getDate() + "." + data.endedAt?.getMonth() + "." + data.endedAt?.getFullYear(),
        sulfurDioxide: data.sulfurDioxide
      });
    }
    
    this.setState ({
      exposureData: exposureData
    })
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
                  <option>Daily</option>
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
                  <option>Carbon monoxide</option>
                  <option>Ozone</option>
                  <option>Nitrogen Dioxine</option>
                  <option>Sulfur Dioxine</option>
                </Select>
              </FormControl>
            </ListItem>
          </List>
        </Box>
      </>
    );
    return (
      <AppLayout>
        <DrawerMenu open={ true } statisticsControls={ statisticsComponent } />
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <Typography variant="h3">
                  { strings.statistics }
                </Typography>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <LineChart 
                  width={730} height={250} 
                  data={ this.state.exposureData }
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="startedAt" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="harmfulMicroparticles" stroke="red" />
                  <Line type="monotone" dataKey="nitrogenDioxide" stroke="black" />
                  <Line type="monotone" dataKey="nitrogenMonoxide" stroke="blue" />
                  <Line type="monotone" dataKey="ozone" stroke="green" />
                  <Line type="monotone" dataKey="sulfurDioxide" stroke="orange" />
                </LineChart>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </AppLayout>
    );
  }
  /**
   * Get data from API
   */
  private getData = async() => {
    if (!this.props.accessToken) {
        return;
    }
    const exposureInstanceApi = Api.getExposureInstancesApi(this.props.accessToken);
    this.setState({
      statisticsData: await exposureInstanceApi.listExposureInstances({})
    })
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
