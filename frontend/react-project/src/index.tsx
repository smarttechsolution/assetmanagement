import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

import store from "./store";
import App from "./App";
// import reportWebVitals from './reportWebVitals';
import SimpleReactLightbox from "simple-react-lightbox";

ReactDOM.render(
  <React.StrictMode>
    <SimpleReactLightbox>
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </SimpleReactLightbox>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
