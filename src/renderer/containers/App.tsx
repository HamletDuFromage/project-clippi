// Import all the styles first since they will be overwritten
import "react-tippy/dist/tippy.css"; // React-tippy styles
import "react-toastify/dist/ReactToastify.min.css"; // Toast styles
import "semantic-ui-css/semantic.min.css"; // Semantic UI styles
import "react-reflex/styles.css";

import "@/styles/index.scss"; // Our custom styles

import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { hot } from "react-hot-loader/root";
import { persistor, store, Dispatch, iRootState } from "@/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "emotion-theming";
import { History } from "@/components/History";
import { ToastContainer } from "@/components/toasts/ToastContainer";
import { darkTheme, GlobalStyle, lightTheme, ThemeManager, ThemeMode, useTheme } from "@/styles";
import { MainView, SettingsView } from "@/views";
import { checkForNewUpdates } from "@/lib/utils";

const App: React.FC = () => {
  const dispatch = useDispatch<Dispatch>();
  const { reconnectTwitch } = useSelector((state: iRootState) => state.twitch);
  const theme = useTheme();
  React.useEffect(() => {
    checkForNewUpdates();
    if (reconnectTwitch) {
      dispatch.tempContainer.authenticateTwitch();
    }
  }, []);
  return (
    <div className={theme.themeName}>
      <History />
      <ToastContainer />
      <ThemeProvider theme={theme.themeName === ThemeMode.LIGHT ? lightTheme : darkTheme}>
        <GlobalStyle />
        <Switch>
          <Route path="/main" component={MainView} />
          <Route path="/settings" component={SettingsView} />
          <Route exact path="/">
            <Redirect to="/main" />
          </Route>
        </Switch>
      </ThemeProvider>
    </div>
  );
};

const AppWithProviders: React.FC = () => {
  // ThemedManager must be declared and instantiated before useTheme() is called
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeManager>
          <Router>
            <App />
          </Router>
        </ThemeManager>
      </PersistGate>
    </Provider>
  );
};

export default hot(AppWithProviders);
