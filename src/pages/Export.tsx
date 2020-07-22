import React, { useContext } from "react";
import DevTable from "../components/DevExtremeTable";

import ProvenanceDataContext from "../components/ProvenanceDataContext";

const Export = () => {
  const { currentTaskData } = useContext(ProvenanceDataContext);

  return <DevTable provenanceData={currentTaskData}></DevTable>;
};

export default Export;
