import React from "react";
import { MyshiftLayout } from "./components/layouts/Main/MyshiftLayout";
import { HashRouter } from 'react-router-dom';
function App() {
  return (
    <HashRouter>
    <div className="App" data-test-id="app-component">
      <MyshiftLayout />
    </div>
    </HashRouter>
  );
}

export default App;
