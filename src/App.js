import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Layout from './components/layout';
import LocationTrace from './components/views/LocationTrace';

function App() {
  return (
    <Router>
        <Layout>
            <Switch>
              <Route exact path="/" component={LocationTrace}/>
              <Route exact path="/about" render={() => <div>About</div>} />
            </Switch>
        </Layout>
    </Router>
  );
}

export default App;
