import { createTheme } from "@mui/material/styles";


export const CustomFontTheme = createTheme({
  typography: {
    fontSize: 30,
    fontFamily: [
      'Lato'
    ].join(',')
  }
});