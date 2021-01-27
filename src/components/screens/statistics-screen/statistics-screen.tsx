import { Box, FormControl, InputLabel, Paper, Select, Typography, Toolbar, Button } from "@material-ui/core";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import { History } from "history";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { CartesianGrid, Legend, Tooltip, XAxis, YAxis, BarChart, Bar, ResponsiveContainer } from "recharts";
import { Dispatch } from "redux";
import Api from "../../../api";
import { ExposureInstance } from "../../../generated/client";
import strings from "../../../localization/strings";
import { ReduxActions, ReduxState } from "../../../store";
import { NullableToken } from "../../../types";
import AppLayout from "../../layouts/app-layout/app-layout";
import { styles } from "./statistics-screen.styles";
import MomentUtils from "@date-io/moment";
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

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
  calendarDate: Date;
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
      exposureData: [],
      calendarDate: new Date(),
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
    const { accessToken, keycloak } = this.props;
    return (
      <AppLayout 
        accessToken={ accessToken }
        keycloak={ keycloak }
        showDrawer={ true }
        drawerContent={
          this.getStatisticsSidebarComponent()
        }
      >
        <Box p={ 4 }>
          <Paper>
            <Box display="flex" pl={ 4 } pt={ 4 } pr={ 4 }>
              <Box flexGrow={ 1 }>
                <Typography  variant="h3">
                  { this.state.calendarDate.toLocaleDateString() }
                </Typography>
              </Box>
              <Box>
                { this.staticticsSelectTimeRange() }
              </Box>
            </Box>
            { this.staticticsPollutantToolbar() }
            { this.staticticsBarChart() }          
          </Paper>
        </Box>
      </AppLayout>
    );
  }

  /**
   * Method for rendering statictics bar chart
   */
  private staticticsBarChart = () => {
    const { exposureData } = this.state;
    const { classes } = this.props;
    return (
      <Box className={ classes.chartContainerStyling }>
        <ResponsiveContainer>
          <BarChart
            data={ exposureData }
            margin={{
              top: 32, right: 32, left: 32, bottom: 32,
            }}
            barCategoryGap="8"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="startedAt" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="harmfulMicroparticles" stackId="a" fill="#91C4D1" />
            <Bar dataKey="nitrogenDioxide" stackId="a" fill="#91C4D1" />
            <Bar dataKey="nitrogenMonoxide" stackId="a" fill="#91C4D1" />
            <Bar dataKey="ozone" stackId="a" fill="#91C4D1" />
            <Bar dataKey="sulfurDioxide" stackId="a" fill="#91C4D1" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  /**
   * Method for rendering time range dropdown
   */
  private staticticsSelectTimeRange = () => {
    const { classes } = this.props;
    return (
      <FormControl variant="outlined" className={ classes.formControl }>
        <InputLabel htmlFor="outlined-age-native-simple">{ strings.statistics.selectTimeRange }</InputLabel>
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
    );
  }

  /**
   * Method for rendering pollutant toolbar
   */
  private staticticsPollutantToolbar = () => {
    return (
      <Toolbar>
        { this.pollutantToolbarButton(strings.statistics.carbonMonoxide) }
        { this.pollutantToolbarButton(strings.statistics.ozone) }
        { this.pollutantToolbarButton(strings.statistics.nitrogenDioxide) }
        { this.pollutantToolbarButton(strings.statistics.sulfurDioxide) }
     </Toolbar>
    );
  }

  /**
   * Method for rendering pollutant toolbar button
   * @param label pollutant button string
   */
  private pollutantToolbarButton = (label: String) => {
    return (
      <Button
      color="primary"
      variant="contained"
      startIcon={ <RemoveRedEyeIcon /> } 
      >
        { label }
      </Button>
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
    return (
      <Box mt={ 10 }>
        { this.showCalendar() }
      </Box>
    )
  }

  /**
   * Method for rendering calendar
   */
  private showCalendar = () => {
    const { calendarDate } = this.state;
    return (
      <MuiPickersUtilsProvider utils = { MomentUtils }>
        <DatePicker 
        value = { calendarDate }
        onChange = { action => this.onDateChange(action) }
        variant = "static"
        disableToolbar = { true }
        />
      </MuiPickersUtilsProvider>
    );
  }

  /**
   * method for changing calendar date
   * @param action material-UI date picker
   */
  private onDateChange = (action: MaterialUiPickersDate) => {
    const selectedDate = action?.toDate();
    this.setState({
      calendarDate: selectedDate!
    });
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
