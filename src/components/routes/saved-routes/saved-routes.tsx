import { Divider, ListItem, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Route } from "../../../generated/client";
import { styles } from "./saved-routes.styles";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  savedRoutes?: Route[],
  showSavedRoutes?: boolean,
}

/**
 * Interface describing component state
 */
interface State {
  showAllUserRoutes: boolean,
}

class SavedRoutes extends React.Component<Props, State> {
  /**
   * 
   * 
   * @param props
   */
  constructor (props: Props) {
    super(props);
    this.state = {
      showAllUserRoutes: false,
    };
  }

  public render = () => {
    const { savedRoutes, showSavedRoutes, classes } = this.props;
    const { showAllUserRoutes } = this.state;

    if (!savedRoutes || !showSavedRoutes) {
      return;
    }

    const userRoutes = savedRoutes.map(route => {
      if (route.locationFromName && route.locationToName) {
        return route;
      }
    }) as Route[];

    const shortRoutes = userRoutes.splice(0, 2);
    const routes = showAllUserRoutes ? userRoutes : shortRoutes;

    return routes.map((route, index) => {
      
      if (!route) {
        return null;
      }
      
      const  savedTime = `Saved on: ${ route.savedAt?.getDay() }.${ route.savedAt?.getMonth() }.${ route.savedAt?.getFullYear() }`;
      const from = `From: ${ route.locationFromName.slice(0, 40) }...`;
      const to = `To: ${ route.locationToName.slice(0, 40) }...`;

      return (
        <div key={ index }>
          <ListItem>
            <div>
              <h4>
                { savedTime }
              </h4>
              <p>
                { from }
              </p>
              <p>
                { to }
              </p>
            </div>
          </ListItem>
          <Divider />
        </div>
      )
    });
  }
}

export default withStyles(styles)(SavedRoutes);
