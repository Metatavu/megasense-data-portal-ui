import React from "react";

import { Dispatch } from "redux";
import { connect } from "react-redux";
import { NullableToken } from "../../../types";
import strings from "../../../localization/strings";
import { Container, Typography, WithStyles, withStyles } from "@material-ui/core";
import AppLayout from "../../layouts/app-layout/app-layout";
import { ReduxActions, ReduxState } from "../../../store";
import styles from "../../../styles/screens/about-screen"

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  accessToken?: NullableToken;
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
    const { classes } = this.props;
    return (
      <AppLayout>
        <Container>
        <Typography className={ classes.title } variant="h3">
          { strings.aboutScreen.title }
        </Typography>
        <Typography className={ classes.subTitle } variant="subtitle2">
          { strings.aboutScreen.subTitle }
        </Typography>
        <Typography className={ classes.descriptionText } variant="body2">
          { strings.aboutScreen.descriptionText }
        </Typography>
        </Container>
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
    accessToken: state.auth.accessToken
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
