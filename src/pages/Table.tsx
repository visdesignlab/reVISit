import React from "react";
import { relativeProvenanceData } from "../common/data/provenanceMocks.js";
import MaterialTableWrapper from "../components/ProvenanceTable";

const Table = ({ location }) => {
  let newData = relativeProvenanceData[0].map((dataArr) => {
    return { provGraph: dataArr };
  });
  for (let i = 0; i < 2; i++) {
    newData = newData.concat(_.cloneDeep(newData));
  }
  return <MaterialTableWrapper provenanceData={newData} />;
};

export default Table;
