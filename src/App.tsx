import React from "react";
import { MemoryRouter, Link as RouterLink } from "react-router-dom";
import styles from "./App.module.css";
import Main from "./Main";
import SidePane from "./SidePane";
import "antd/dist/antd.css";
import { ProvenanceDataContextProvider } from "./components/ProvenanceDataContext";

function App() {
  return (
    <div className="App">
      <ProvenanceDataContextProvider>
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
      </ProvenanceDataContextProvider>
    </div>
  );
}

export default App;
