import { Divider, Drawer, Hidden, List, MenuItem, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import strings from "../../../localization/strings";
import { styles } from "./responsive-side-menu.styles";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  toggleSideMenu: () => void;
  open: boolean;
}

/**
 * Interface describing component state
 */
interface State {

}

class ResponsiveSideMenu extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {

    };
  }

  public render = () => {
    const { classes, open, toggleSideMenu } = this.props;
    return (
      <div>
        <Hidden implementation="css">
          <Drawer
            variant="persistent"
            anchor="left"
            open={ open }
            onClose={ toggleSideMenu }
            ModalProps={{
              keepMounted: true
            }}
          >
            { this.renderDrawerContent() }
          </Drawer>
        </Hidden>
      </div>
    );
  }

  /**
   * Renders the menu content
   */
  private renderDrawerContent = () => {
    const { classes } = this.props;
    
    return (
      <div className={ classes.menuContainer }>
        <List className={ classes.menu }>
          <MenuItem className={ classes.menuItemContainer }>
            <Link className={ classes.menuItem } to="/map">
              { strings.map }
            </Link>
          </MenuItem>
          <MenuItem className={ classes.menuItemContainer }>
            <Link className={ classes.menuItem } to="/statistics">
              { strings.statistics }
            </Link>
          </MenuItem>
          <MenuItem className={ classes.menuItemContainer }>
            <Link className={ classes.menuItem } to="/saved-routes">
              { strings.savedRoutes }
            </Link>
          </MenuItem>
          <MenuItem className={ classes.menuItemContainer }>
            <Link className={ classes.menuItem } to="/settings">
              { strings.settings }
            </Link>
          </MenuItem>
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(ResponsiveSideMenu);