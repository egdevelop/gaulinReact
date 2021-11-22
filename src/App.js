import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Beranda from "./sebel/pages/beranda";
import Login from "./sebel/pages/Login";
import Register from "./sebel/pages/Register";

function App() {
  return (
    <Fragment>
      <Router>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/home">
          <Beranda />
        </Route>
        <Route exact path="/regis">
          <Register />
        </Route>
      </Router>
    </Fragment>
  );
}

export default App;
