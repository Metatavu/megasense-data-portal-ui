import { withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { styles } from "./app-layout.styles";
import MobileTopBar from "../../generic/mobile-top-bar/mobile-top-bar";
import ResponsiveSideMenu from "../../generic/responsive-side-menu/responsive-side-menu";
import { Grid } from "@material-ui/core";

interface Props extends WithStyles<typeof styles> {
  routing?: JSX.Element
}

interface State {
  sideMenuOpen: boolean;
}

class AppLayout extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {
      sideMenuOpen: false
    };
  }

  public render = () => {
    const { classes, children } = this.props;
    
    return (
      <div className={ classes.root }>
        <MobileTopBar
          routing={ this.props.routing }
          toggleSideMenu={ this.toggleSideMenu }
        />
        <ResponsiveSideMenu
          open={ this.state.sideMenuOpen }
          toggleSideMenu={ this.toggleSideMenu }
        />
        <div className={ classes.content }>
            { children }
        </div>
      </div>
    );
  }

  private toggleSideMenu = () => {
    const sideMenuOpen = !this.state.sideMenuOpen;
    this.setState({ sideMenuOpen });
  }
}

export default withStyles(styles)(AppLayout)
