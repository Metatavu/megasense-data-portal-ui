
import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme();
const { spacing } = theme;

export default createMuiTheme({

  palette: {
    primary: {
      main: "#277B90",
      light: "#fff"
    },
    secondary: {
      main: "#7BD4F0"
    },
    background: {
      default: "#DCE2E9",
      paper: "#F7F9FC"
    },
    success: {
      main: "#61C88D"
    },
    error: {
      main: "#E25353"
    },
    text: {
      primary: "#252729",
      disabled: "#C2C9CF"
    },
    grey: {
      "100": "#252729",
      "200": "#51575C",
      "400": "#939BA3",
      "600": "#C2C9CF",
      "700": "#DCE2E9",
      "800": "#F7F9FC",
      "900": "#FEFEFF"
    },
    info: {
      main: "#7BD4F0"
    },
    warning: {
      main: "#E25353"
    }
  },

  typography: {
    fontFamily: "'Noto Sans JP', sans-serif",
    h1: {
      fontSize: 24
    },

    h2: {
      fontWeight: 300,
      fontSize: 20
    },

    h3: {
      fontSize: 16,
      fontWeight: 800,
      lineHeight: 1.5
    }
  },

  overrides: {
    MuiCssBaseline: {
      // Global css overrides
      "@global": {
        "a": {
          textDecoration: "none"
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: "#DCE2E9"
        },
        "::-webkit-scrollbar": {
          height: 5,
          width: 10
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#277B90",
          borderColor: "#DCE2E9",
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 10
        }
      }
    },
    MuiButton: {
      root: {
        textTransform: "initial",
        borderRadius: 50
      },
      outlined: {
        borderRadius: 50
      },
      containedSecondary: {
        color: "#fff"
      }
    },
    MuiTextField: {
      root: {
      },
    },
    MuiListItemAvatar: {
      root: {

      }
    },
    MuiAvatar: {
      colorDefault: {
        backgroundColor: "rgba(39,123,144,0.6)"
      }
    },
    MuiListItemText: {
      secondary: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
      }
    },
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: 0
      }
    },
    MuiDivider: {
      light: {
        backgroundColor: "rgba(255,255,255,0.2)"
      }
    },
    MuiSlider: {
      rail: {
        height: 8,
        borderRadius: 5
      },  
      thumb: {
        height: 18,
        width: 18,
      },
      mark: {
        height: 8,
        width: 8,
        borderRadius: 5
      }
    },
    MuiAccordionSummary: {
      root: {
        backgroundColor: "#277B90",
        borderRadius: 4,
        height: 64,
        marginTop: spacing(2),
        color: "#FFFFFF"
      }
    },
    MuiAccordionDetails: {
      root: {
        display: "block",
        backgroundColor: "#F7F9FC",
      }
    },
    MuiFormControlLabel: {
      labelPlacementStart: {
        marginLeft: 0,
      },
      label: {
        marginRight: "auto"
      }
    },
    MuiInput: {
      underline: {
        '&:before': {
            borderBottom: "1px solid #FFF"
        },
        '&:hover': {
            borderBottom: "1px solid #FFF"
        },
        '&:after': {
            borderBottom: "2px solid #FFF"
          }
      }
    },
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: "#277B90"
        }
      }
    },
    MuiDialog: {
      paper: {
        padding: theme.spacing(2)
      }
    },
    MuiDialogActions: {
      root: {
        padding: theme.spacing(1)
      }
    },
    MuiDialogContent: {
      root: {
        padding: theme.spacing(1)
      }
    },
    MuiDialogTitle: {
      root: {
        padding: theme.spacing(1)
      }
    }
  },
  props: {
    MuiButton: {
      variant: "outlined"
    },
    MuiTextField: {
      variant: "outlined"
    }
  }
});