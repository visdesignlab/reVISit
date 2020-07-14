import React, { useContext } from "react";
import {
  relativeProvenanceData,
  unrelativeProvenanceData,
} from "../common/data/provenanceMocks.js";

import MaterialTableWrapper from "../components/ProvenanceTable";

import ProvenanceDataContext from "../components/ProvenanceDataContext";

const Table = ({ location }) => {
  const { currentTaskData } = useContext(ProvenanceDataContext);
  return (
    <div>
      <MaterialTableWrapper provenanceData={currentTaskData} />
    </div>
  );
};

export default Table;
