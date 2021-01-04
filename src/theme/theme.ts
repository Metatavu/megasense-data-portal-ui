
import { createMuiTheme } from '@material-ui/core';

export default createMuiTheme({

  palette: {
    primary: {
      main: "#277B90",
      light: "#fff"
    },
    secondary: {
      main: "#52A8D9"
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

  typography: {},

  overrides: {
    MuiButton: {
      root: {
        textTransform: "lowercase"
      },
    },
    MuiTextField: {
      root: {
        variant: "outlined"
      },
    },
    MuiCssBaseline: {
      "@global": {
        "::-webkit-scrollbar-track": {
          backgroundColor: "#C2C9CF"
        },
        "::-webkit-scrollbar": {
          height: 5,
          width: 5
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#004C97",
          border: "none",
          borderRadius: 1
        }
      }
    }
  },
  props: {
    MuiButton: {
      variant: "text"
    }
  }
});