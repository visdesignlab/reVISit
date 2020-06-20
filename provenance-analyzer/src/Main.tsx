import React from "react";
import { withRouter } from "react-router-dom";
import styles from "./Main.module.css";
import _ from "lodash";
import { relativeProvenanceData } from "./common/data/provenanceMocks.js";
import MaterialTableWrapper from "./components/ProvenanceTable";

const Main = ({ location }) => {
  let newData = relativeProvenanceData[0].map((dataArr) => {
    return { provGraph: dataArr };
  });
  for (let i = 0; i < 2; i++) {
    newData = newData.concat(_.cloneDeep(newData));
  }
  return <MaterialTableWrapper provenanceData={newData} />;
};

export default withRouter(Main);
