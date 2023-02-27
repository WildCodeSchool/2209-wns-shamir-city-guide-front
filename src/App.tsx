import Router from "./Router";
import { ThemeProvider } from "@mui/material/styles";
import { CustomFontTheme } from "./style/CustomFontTheme";


const App = () => {
  return <div className="App">
    <ThemeProvider theme={CustomFontTheme}>
        <Router />
    </ThemeProvider>
  </div>;
}

export default App;
