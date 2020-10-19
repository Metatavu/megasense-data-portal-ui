import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AccessTokenRefresh from "./containers/access-token-refresh";
import Home from "./screens/home-screen/home-screen";
import MapScreen from "./screens/map-screen/map-screen";
import SavedRoutes from "./screens/saved-routes-screen/saved-routes";
import Statistics from "./screens/statistics-screen/statistics";
import Settings from "./screens/settings-screen/settings-screen";
import { ThemeProvider } from '@material-ui/core';
import  theme  from "../theme/theme"
/**
 * Interface describing component properties
 */
interface Props {}

/**
 * Interface describing component state
 */
interface State {}

/**
 * App component
 */
class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ThemeProvider theme={ theme }>
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
            render={() => (
              <Statistics />
            )}
            />
            <Route
            exact
            path="/settings"
            render={() => (
              <Settings />
            )}
            />
          </Switch>
        </BrowserRouter>
      </AccessTokenRefresh>
      </ThemeProvider>
    );
  }
}

export default App;