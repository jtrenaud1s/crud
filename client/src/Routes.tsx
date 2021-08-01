import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import Bye from "./pages/Bye";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/bye" component={Bye} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
