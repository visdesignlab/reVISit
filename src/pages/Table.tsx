import React, { useContext } from "react";
import Modal from "@material-ui/core/Modal";

import TableDataLoader from "../components/TableDataLoader";
import ProvenanceDataContext from "../components/ProvenanceDataContext";
import ProvenanceController from "../components/ProvenanceController";

const Table = ({ location }) => {
  const { currentlyVisitedNodes, setCurrentlyVisitedNodes } = useContext(
    ProvenanceDataContext
  );
  console.log(currentlyVisitedNodes, setCurrentlyVisitedNodes);
  return (
    <React.Fragment>
      <TableDataLoader />
      {currentlyVisitedNodes && (
        <Modal
          open={true}
          onClose={() => setCurrentlyVisitedNodes(null)}
          style={{ backgroundColor: "whitesmoke" }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description">
          <ProvenanceController
            nodes={currentlyVisitedNodes}
            selectedNode={currentlyVisitedNodes[0]}></ProvenanceController>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Table;
