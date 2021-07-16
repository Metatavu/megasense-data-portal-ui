import React from "react";
import { createStore } from "redux";
import theme from "../theme/theme";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import HomeScreen from "./screens/home-screen/home-screen";
import MapScreen from "./screens/map-screen/map-screen";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import StatisticsScreen from "./screens/statistics-screen/statistics-screen";
import RegistrationScreen from "./screens/registration-screen/registration-screen";
import Settings from "./screens/settings-screen/settings-screen";
import { ReduxActions, ReduxState, rootReducer } from "../store";
import AccessTokenRefresh from "./containers/access-token-refresh";
import SavedRoutesScreen from "./screens/saved-routes-screen/saved-routes-screen";
import SavedLocationsScreen from "./screens/saved-locations-screen/saved-locations-screen";
import AboutScreen from "./screens/about-screen/about-screen";
import 'moment/locale/fi';
import moment from "moment";
import strings from "../localization/strings";
import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry Redux enhancer
 */
 const sentryReduxEnhancer = Sentry.createReduxEnhancer({});

/**
 * Initialize Redux store
 */
const store = createStore<ReduxState, ReduxActions, any, any>(rootReducer,sentryReduxEnhancer);

/**
 * Interface describing component properties
 */
interface Props { 
}

/**
 * Interface describing component state
 */
interface State {
}

/**
 * App component
 */
class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  
  public render() {
    moment.locale(strings.getLanguage());
    return (
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        <Provider store={ store }>
          <AccessTokenRefresh>
            <BrowserRouter>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={({ history }) => (
                    <HomeScreen history={ history } />
                  )}
                />
                <Route
                  exact
                  path="/map"
                  render={() => (
                    <MapScreen />
                  )}
                />
                <Route
                  exact
                  path="/saved-routes"
                  render={() => (
                    <SavedRoutesScreen />
                  )}
                />
                <Route
                  exact
                  path="/saved-locations"
                  render={() => (
                    <SavedLocationsScreen />
                  )}
                />
                <Route
                  exact
                  path="/statistics"
                  render={({ history }) => (
                    <StatisticsScreen history={ history } />
                  )}
                />
                <Route
                  exact
                  path="/settings"
                  render={({ history }) => (
                    <Settings history={ history } />
                  )}
                />
                <Route
                  exact
                  path="/about"
                  render={() => (
                    <AboutScreen />
                  )}
                />
                <Route
                  exact
                  path="/registration"
                  render={({ history }) => (
                    <RegistrationScreen history={ history } />
                  )}
                />
              </Switch>
            </BrowserRouter>
          </AccessTokenRefresh>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default Sentry.withProfiler(App);