import React from "react";
import { createStore } from "redux";
import theme from "../theme/theme";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import Home from "./screens/home-screen/home-screen";
import MapScreen from "./screens/map-screen/map-screen";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Statistics from "./screens/statistics-screen/statistics";
import Settings from "./screens/settings-screen/settings-screen";
import { ReduxActions, ReduxState, rootReducer } from "../store";
import AccessTokenRefresh from "./containers/access-token-refresh";
import SavedRoutes from "./screens/saved-routes-screen/saved-routes";

/**
 * Initialize Redux store
 */
const store = createStore<ReduxState, ReduxActions, any, any>(rootReducer);

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
                  render={() => (
                    <Home />
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
                    <SavedRoutes />
                  )}
                />
                <Route
                  exact
                  path="/statistics"
                  render={({ history }) => (
                    <Statistics history={ history } />
                  )}
                />
                <Route
                  exact
                  path="/settings"
                  render={({ history }) => (
                    <Settings history={ history } />
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

export default App;
