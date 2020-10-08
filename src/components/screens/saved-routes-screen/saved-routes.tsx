import Alert from "@material-ui/lab/Alert";
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

import { Card, CardContent, CardActions } from "@material-ui/core";

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
            Saved routes
          </Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" component="p">
                  { strings.savedRoutesFrom }: Hallituskatu
                  <br />
                  { strings.savedRoutesTo }: Otavankatu
                </Typography>
                <Typography variant="caption" component="p">
                  { strings.savedRoutesSavedText }: 40.40.2020
                </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" size="small">Preview routew</Button>
              <Button variant="contained" color="secondary" size="small">Delete route</Button>
            </CardActions>
          </Card>
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
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedRoutes);