import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AccessTokenRefresh from "./containers/access-token-refresh";
import TestScreen from "./screens/test-screen";

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

  render() {
    return (
      <AccessTokenRefresh>
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <TestScreen/>
              )}
            ></Route>
          </Switch>
        </BrowserRouter>

      </AccessTokenRefresh>
    );
  }

}

export default App;
