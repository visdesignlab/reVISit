import React, { useContext } from "react";
import DevTable from "../components/DevExtremeTable";

import ProvenanceDataContext from "../components/ProvenanceDataContext";

const Export = () => {
  const { currentTaskData, handleProvenanceNodeClick, data } = useContext(
    ProvenanceDataContext
  );
  console.log("dywootto", currentTaskData);
  return (
    <DevTable
      provenanceData={currentTaskData}
      handleProvenanceNodeClick={handleProvenanceNodeClick}></DevTable>
  );
};

export default Export;
