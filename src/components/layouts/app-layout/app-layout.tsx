import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { styles } from "./app-layout.styles";
import Header from "../../generic/header/header";
import { Toolbar } from "@material-ui/core";
import { NullableToken } from "../../../types";

interface Props extends WithStyles<typeof styles> {
  routing?: JSX.Element;
  accessToken?: NullableToken;
  keycloak?: Keycloak.KeycloakInstance;
}

interface State {
  sideMenuOpen: boolean;
}


/**
 * AppLayout component
 */
class AppLayout extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props props
   */
  constructor (props: Props) {
    super(props);
    this.state = {
      sideMenuOpen: false
    };
  }

  /**
   * Component render method
   */
  public render = () => {
    const { accessToken, keycloak, classes, children } = this.props;
    
    return (
      <div className={ classes.root }>
        <Header
          accessToken={ accessToken }
          keycloak={ keycloak }
          routing={ this.props.routing }
          toggleSideMenu={ this.toggleSideMenu }
        />
        {/* Empty toolbar to add correct spacing to prevent the content to go below the App header */}
        <Toolbar />
        <div className={ classes.content }>
          { children }
        </div>
      </div>
    );
  }

  /**
   * Side menu toggle
   */
  private toggleSideMenu = () => {
    const sideMenuOpen = !this.state.sideMenuOpen;
    this.setState({ 
      sideMenuOpen: sideMenuOpen 
    });
  }
}

export default withStyles(styles)(AppLayout)
