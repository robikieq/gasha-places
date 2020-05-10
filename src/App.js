import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LocationTrace from "./components/views/LocationTrace";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LocationTrace} />
        <Route exact path="/about" render={() => <div>About</div>} />
      </Switch>
    </Router>
  );
}

export default App;
