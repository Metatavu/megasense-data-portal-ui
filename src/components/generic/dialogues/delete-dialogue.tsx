import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, WithStyles, withStyles } from "@material-ui/core";
import { styles } from "./delete-dialogue.styles";
import React from "react";
import { Route } from "../../../generated/client";
import strings from "../../../localization/strings";
import moment from "moment";

/**
 * Interface describing component props
 */
interface Props extends WithStyles<typeof styles> {
  routeDeleteInitiated: boolean;
  routeToDelete?: Route;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

/**
 * Interface describing component state
 */
interface State {}

/**
 * Component for generic delete dialogue
 */
class DeleteDialogue extends React.Component<Props, State> {

  /**
   * Component constructor
   * 
   * @param props
   */
  constructor (props: Props) {
    super(props);
    this.state = {};
  }

  /**
   * Component render method
   */
  public render = () => {
    const { classes, routeDeleteInitiated, routeToDelete, onDeleteConfirm, onDeleteCancel } = this.props;

    return (
      <Dialog
        open={ routeDeleteInitiated }
        onClose={ onDeleteCancel }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          { strings.deleteConfirm }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { strings.savedRoutesFrom }: { routeToDelete ? routeToDelete.locationFromName : "" }
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            { strings.savedRoutesTo }: { routeToDelete ? routeToDelete.locationToName : "" }
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            { strings.savedRoutesSavedText }:  { routeToDelete ? this.dateToYMD(routeToDelete.savedAt!) : "" }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" className={ classes.errorButton } onClick={ onDeleteConfirm }>
            { strings.yes }
          </Button>

          <Button variant="contained" className={ classes.warningButton } onClick={ onDeleteCancel } color="primary" autoFocus>
            { strings.cancel }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  /**
   * Converts Date to a string in YY-MM-DD format
   * 
   * @param date A date to convert
   * 
   * @returns A string in YY-MM-DD format
   */
  private dateToYMD = (date: Date): string => {
    return moment(date).format('MM-DD-YYYY');
  }
}

export default withStyles(styles)(DeleteDialogue);
