import React from "react";

import { Dispatch } from "redux";
import { connect } from "react-redux";
import { NullableToken } from "../../../types";
import strings from "../../../localization/strings";
import { Typography, WithStyles, withStyles, Grid } from "@material-ui/core";
import AppLayout from "../../layouts/app-layout/app-layout";
import { ReduxActions, ReduxState } from "../../../store";
import styles from "./about-screen.styles";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
}

/**
 * Interface describing component state
 */
interface State {
}

/**
 * Component for about screen
 */
class AboutScreen extends React.Component<Props, State> {

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
  public render() {
    const { classes, accessToken, keycloak } = this.props;
    return (
      <AppLayout
        accessToken={ accessToken }
        keycloak={ keycloak }
      >
        <Grid container className={ classes.backgroundContainer }>
          <Grid container className={ classes.infoTexts }>
            <Typography className={ classes.title } variant="h1">
              { strings.aboutScreen.title }
            </Typography>
            <Typography className={ classes.subTitle } variant="h2">
              { strings.aboutScreen.subTitle }
              { strings.aboutScreen.descriptionText }
            </Typography>
          </Grid>
        </Grid>
      </AppLayout>
    );
  }
}

/**
 * Redux mapper for mapping store state to component props
 * 
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
  return {
  };
}

const Styled = withStyles(styles)(AboutScreen);

export default connect(mapStateToProps, mapDispatchToProps)(Styled);
