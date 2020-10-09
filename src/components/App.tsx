import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AccessTokenRefresh from "./containers/access-token-refresh";
import WelcomeScreen from "./screens/welcome-screen/welcome-screen";
import MapScreen from "./screens/map-screen/map-screen";
import SavedRoutes from "./screens/saved-routes-screen/saved-routes";
import Statistics from "./screens/statistics-screen/statistics"
/**
 * Interface describing component properties
 */
interface Props { }

/**
 * Interface describing component state
 */
interface State { }

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
      <AccessTokenRefresh>
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <WelcomeScreen />
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
          </Switch>
        </BrowserRouter>

      </AccessTokenRefresh>
    );
  }
}

export default App;
