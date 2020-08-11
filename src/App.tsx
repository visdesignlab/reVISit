import React from "react";
import { MemoryRouter, Link as RouterLink } from "react-router-dom";
import styles from "./App.module.css";
import Main from "./Main";
import SidePane from "./SidePane";
import "antd/dist/antd.css";
import { ProvenanceDataContextProvider } from "./components/ProvenanceDataContext";
import { ProvenanceTrrackContextProvider } from "./components/ProvenanceTrrackContext";

//import { fetchProvenance } from "./firebase/fetchData";
//fetchProvenance();
function App() {
  return (
    <div className="App">
      {
        <ProvenanceTrrackContextProvider>
          <ProvenanceDataContextProvider>
            <MemoryRouter initialEntries={["/Home"]} initialIndex={0}>
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
        </ProvenanceTrrackContextProvider>
      }
    </div>
  );
}

export default App;
