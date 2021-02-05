
import { createMuiTheme } from '@material-ui/core';

export default createMuiTheme({

  palette: {
    primary: {
      main: "#277B90",
      light: "#fff"
    },
    secondary: {
      main: "#00a2ff"
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
      main: "#F6D46C"
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
  },

  overrides: {
    MuiCssBaseline: {
      // Global css overrides
      "@global": {
        "a": {
          textDecoration: "none"
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: "#C2C9CF"
        },
        "::-webkit-scrollbar": {
          height: 5,
          width: 5
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#51575C",
          border: "none",
          borderRadius: 1
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