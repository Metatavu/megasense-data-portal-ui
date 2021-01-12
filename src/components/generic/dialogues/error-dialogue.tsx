import * as React from "react";

import strings from "../../../localization/strings";
import * as moment from "moment";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

/**
 * Interface representing component properties
 */
interface Props {
  error?: string | Error | Response;
  onClose: () => void;
}

/**
 * Interface representing component state
 */
interface State {
  errorMessage?: string;
}

/**
 * React component displaying error dialogs
 */
export default class ErrorDialogue extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = { };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    this.setState({
      errorMessage: await this.getErrorMessage()
    });
  }

  /** 
   * Component render method
   */
  public render() {
    return (
      <Dialog open={ true } onClose={ this.props.onClose }>
        <DialogTitle id="error-dialog-title">{ strings.errorDialog.title }</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            <p> { strings.errorDialog.reloadPage } </p>
            <p> { strings.errorDialog.unsavedContents } </p>
            <p> { strings.errorDialog.reportIssue } </p>
            <p>
              { strings.errorDialog.technicalDetails }<br/>
              <br/>
              { strings.formatString(strings.errorDialog.time, this.getTime()) }<br/>
              { strings.formatString(strings.errorDialog.url, this.getURL()) }<br/>
              { strings.errorDialog.errorMessage }<br/>
              <br/>
              <pre style={{ fontSize: "10px" }}>{  this.state.errorMessage || "" }</pre>
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ this.onReloadClick } color="primary">
            { strings.errorDialog.reload }
          </Button>
          <Button disableElevation variant="contained" onClick={ this.props.onClose } color="secondary" autoFocus>
            { strings.errorDialog.close }
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  /**
   * Returns current time
   * 
   * @returns current time
   */
  private getTime = () => {
    return moment.default().format();
  }

  /**
   * Returns current window URL
   * 
   * @returns current window URL
   */
  private getURL = () => {
    return window.location.href;
  }

  /**
   * Returns an error message
   * 
   * @returns an error message
   */
  private getErrorMessage = async (): Promise<string> => {
    if (this.props.error instanceof Error) {
      return this.props.error.message || "";
    } else if (this.props.error instanceof Response) {
      return await this.props.error.text()
    } else {
      return this.props.error || "";
    }
  }

  /**
   * Reload button click event handler
   */
  private onReloadClick = () => {
    window.location.reload(true);
  }

}