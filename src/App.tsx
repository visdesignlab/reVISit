import React from "react";
import { MemoryRouter, Link as RouterLink } from "react-router-dom";
import styles from "./App.module.css";
import Main from "./Main";
import SidePane from "./SidePane";

function App() {
  return (
    <div className="App">
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <div className={styles.container}>
          <div className={styles.sidePane}>
            <SidePane></SidePane>
          </div>
          <div className={styles.main}>
            <Main></Main>
          </div>
        </div>
      </MemoryRouter>
    </div>
  );
}

export default App;
