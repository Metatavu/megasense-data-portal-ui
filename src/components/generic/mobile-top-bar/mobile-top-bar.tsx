import { AppBar, IconButton, Toolbar, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { styles } from "./mobile-top-bar.styles";
import MenuIcon from '@material-ui/icons/Menu';

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  toggleSideMenu: () => void;
  routing?: JSX.Element
}

/**
 * Interface describing component state
 */
interface State {

}

class MobileTopBar extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props);
    this.state = {

    };
  }

  public render = () => {
    const { classes, toggleSideMenu } = this.props;

    return (
        <div className={ classes.root }>
          <AppBar className={ classes.appBar } position="fixed">
            <Toolbar>
              <IconButton
                className={ classes.menuButton }
                edge="start"
                onClick={ toggleSideMenu }
              >
                <MenuIcon fontSize="inherit"/>
              </IconButton>
              {
                this.props.routing
              }
            </Toolbar>
          </AppBar>
        </div>
    );
  }

}


export default withStyles(styles)(MobileTopBar);