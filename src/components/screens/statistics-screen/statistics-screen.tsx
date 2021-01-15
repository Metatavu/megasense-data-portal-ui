import { Box, Drawer, FormControl, InputLabel, List, ListItem, Paper, Select, TextField } from "@material-ui/core";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { History } from "history";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Dispatch } from "redux";
import Api from "../../../api";
import { ExposureInstance } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { NullableToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { styles } from "./statistics-screen.styles";


/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
  history: History<History.LocationState>;
}

/**
 * Exposure data for statistics table
 */
interface ExposureData {
  id?: string;
  harmfulMicroparticles?: number;
  nitrogenDioxide?: number;
  nitrogenMonoxide?: number;
  ozone?: number;
  routeId: string;
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
  exposureData: ExposureData[];
}

/**
 * Component for statistics screen
 */
class StatisticsScreen extends React.Component<Props, State> {

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
    const { accessToken, history } = this.props;

    if (!accessToken) {
      history.push("/");
    }

    await this.getData();
    let exposureData: ExposureData[] = [];
    for (let i = 0; i < this.state.statisticsData.length; i++) {
      const data = this.state.statisticsData[i];
      exposureData.push ({
        id: data.id,
        harmfulMicroparticles: data.harmfulMicroparticles,
        nitrogenDioxide: data.nitrogenDioxide,
        nitrogenMonoxide: data.nitrogenMonoxide,
        ozone: data.ozone,
        routeId: data.routeId || "",
        startedAt: moment(data.startedAt).format("L"),
        endedAt: moment(data.endedAt).format("L"),
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
    const { accessToken, keycloak, classes } = this.props;
    const { exposureData } = this.state;

    return (
      <AppLayout accessToken={ accessToken } keycloak={ keycloak }>
        <Drawer
          open={ true }
          variant="permanent"
          anchor="left"
          classes={{
            paper: classes.drawer,
          }}
        >
          { this.getStatisticsSidebarComponent() }
        </Drawer>
        <Box mt={ 4 } flexGrow={ 1 }>
          <Paper>
            <Box p={ 4 } margin={ "0 auto" }>
              <LineChart 
                width={ 1050 } height={ 550 } 
                data={ exposureData }
                style={{ margin: "0 auto" }}
                >
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
            </Box>
          </Paper>
        </Box>
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

  /**
   * Get statistics sidebar component
   * 
   * @returns statistics sidebar component
   */
  private getStatisticsSidebarComponent = () => {
    const { classes } = this.props
    return(
      <Box mt={ 10 }>
        <List>
          <ListItem>
            <FormControl className={ classes.formControl }>
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
              <InputLabel htmlFor="outlined-age-native-simple">{ strings.statistics.selectPollution }</InputLabel>
              <Select
                native
                fullWidth
                label="Select time range"
                inputProps={{
                  name: "time",
                  id: "outlined-age-native-simple",
                }}
              >
                <option aria-label="None" value="" />
                <option>{ strings.statistics.daily }</option>
                <option>{ strings.statistics.weekly }</option>
                <option>{ strings.statistics.monthly }</option>
                <option>{ strings.statistics.annual }</option>
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
                  name: "age",
                  id: "outlined-age-native-simple",
                }}
              >
                <option aria-label="None" value="" />
                <option>{ strings.statistics.carbonMonoxide }</option>
                <option>{ strings.statistics.ozone }</option>
                <option>{ strings.statistics.nitrogenDioxine }</option>
                <option>{ strings.statistics.sulfurDioxine }</option>
              </Select>
            </FormControl>
          </ListItem>
        </List>
      </Box>
    )
  }
}

/**
 * Redux mapper for mapping store state to component props
 * @param state store state
 */
export function mapStateToProps(state: ReduxState) {
  return {
    accessToken: state.auth.accessToken,
    keycloak: state.auth.keycloak
  };
}

/**
 * Redux mapper for mapping component dispatches 
 * 
 * @param dispatch dispatch method
 */
export function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(StatisticsScreen));
