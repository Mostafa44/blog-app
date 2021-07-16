import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { NavBar, Footer, Loading } from "./components";
import { Home, Profile, ExternalApi } from "./views";
import {NotFound} from './components/NotFound';

import "./app.css";
import EditPost from "./components/EditPost";

const App = () => {
  const { isLoading } = useAuth0();
  const [idToken, setIdToken]= useState('');

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div id="app" className="d-flex flex-column h-100">
      <NavBar />
      <Container className="flex-grow-1 mt-5">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/external-api" component={ExternalApi} />
           <Route
          path="/posts/:postId/edit"
          exact
          render={props => {
            return <EditPost {...props} auth={this.props.auth} />
          }}
        />
          <Route component={NotFound} />
        </Switch>
      </Container>
      <Footer />
    </div>
  );
};

export default App;
