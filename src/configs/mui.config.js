import { createTheme } from "@mui/material";

// https://mui.com/customization/palette/
// Custom lại primary color
const theme = {
  palette: {
    primary: {
      main: "#246AA3",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    },
  },
};

export default createTheme(theme);
