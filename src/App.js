import React, { useState, Fragment, useEffect } from "react";

import LocationTrace from "./components/views/LocationTrace";
import { AppLoading } from "./components/AppLoading";

const showBrandingForSeconds = 3;

function App() {
  const [showAppLoading, setShowAppLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShowAppLoading(false);
    }, showBrandingForSeconds * 1000);
  }, []);
  return (
    <Fragment>
      {showAppLoading && <AppLoading />}
      <LocationTrace />
    </Fragment>
  );
}

export default App;
