import React, { useContext, useEffect, useState } from "react";
import DevTable from "./DevExtremeTable";
import ProvenanceDataContext from "./ProvenanceDataContext";
import Skeleton from "@material-ui/lab/Skeleton";
import LoaderStyles from "./TableDataLoader.module.css";
import Measure from "react-measure";
import { getSchema } from "../fetchers/fetchMocks";
import { useFetchAPIData } from "../hooks/hooks";
import {
  getTaskDataFromServer,
  fetchProvenanceDataByNodeId

} from "../fetchers/fetchMocks.js";
import Modal from "@material-ui/core/Modal";
import ProvenanceController from "../components/ProvenanceController";

import { Alert, AlertTitle } from '@material-ui/lab';
//State
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


const TableDataLoader = (props) => {
  const [height, setHeight] = useState(1000);
  const [currentlyVisitedNodes, setCurrentlyVisitedNodes] = useState(null);

  const {
    selectedTaskId, queryCount,
  } = useContext(ProvenanceDataContext);

  async function handleProvenanceNodeClick(node) {
    console.log("dywootto handle provenance node click", node);

    // hardcoded data for now. ideally, we'll have the event id to be able to select on.
    const participantId = "545d6768fdf99b7f9fca24e3";
    let fetched = await fetchProvenanceDataByNodeId(node.id);
    if (fetched.success) {
      const processedNodes = fetched.data.map((node) => {
        return {
          id: node.id,
          name: node.actionID,
          time: node.elapsedTime,
          nodeID: node.nodeID,
          url: node.url,
          participantId: node.participantID,
          uniqueId: node.uniqueID,
        };
      });
      setCurrentlyVisitedNodes(processedNodes);
    }

  }

  // select all of that provenance graph.
  //const promise = mysql_api(`/actions/${participantId}/${taskId}`);

  //promise.then((resolved) => {
  //  console.log("resolvedclick", resolved);
  //alert(`queried (skinny) provenance from db ${resolved.data}`);

  // rehydrate provenance graph
  // render vis using that provenance graph
  //});

  let [
    isTaskDataLoading,
    isTaskDataError,
    currentTaskData,
  ] = useFetchAPIData(async () => {
    const response = await getTaskDataFromServer(selectedTaskId);
    response.data = response.data.map((datum) => {
      // console.log(datum.sequence);

      // TODO: Fix this from being null
      try {
        datum.sequence = JSON.parse(`[${datum.sequence}]`);
      } catch (err) {
        console.error(
          `[Provenance Data Context] Error Parsing ${datum.participantID}'s event sequence. This is likely caused by the sequence being > 16k characters.`
        );
        datum.sequence = [];
      }
      return datum;
    });
    return response;
  }, [selectedTaskId, queryCount]);

  const [tableSchema, setTableSchema] = useState(null);

  let [isPerformanceSchemaLoading, isPerformanceSchemaError, schemaFromServer] = useFetchAPIData(async () => {
    return await getSchema("Performance");
  }, []);

  // Set Schema
  useEffect(() => {
    let tableSchema = schemaFromServer;

    const hiddenColumns = ["id"];
    // TODO: make this smart, if > column is highly variable, don't show.
    const hideAggregate = ["participantID", "answer"];

    if (tableSchema) {
      // append the provenance sequence nodes onto the end of performance schema

      tableSchema = tableSchema.concat({
        COLUMN_NAME: "sequence",
        DATA_TYPE: "provenance",
        ORDINAL_POSITION: schemaFromServer.length,
      });

      tableSchema = tableSchema.concat({
        COLUMN_NAME: "notes",
        DATA_TYPE: "tag",
        ORDINAL_POSITION: schemaFromServer.length + 2,
      });

      tableSchema = tableSchema.map((column) => {
        column.hideAggregate = hideAggregate.includes(column);
        return column;
      });

      tableSchema = tableSchema.filter(
        (column) => !hiddenColumns.includes(column.COLUMN_NAME)
      );
    }

    setTableSchema(tableSchema);
  }, [schemaFromServer]);
  console.log("tableschema", tableSchema);


  return (
    <div>
      {isTaskDataLoading || isPerformanceSchemaLoading &&
        <div>
          <Measure
            bounds
            onResize={(contentRect) => {
              setHeight(contentRect.bounds.height);
            }}>
            {(measureRef) => {
              console.log("height", height);
              return (
                <div ref={measureRef} className={LoaderStyles.loader}>
                  <Skeleton height={height} variant="rect" animation="wave" />
                </div>
              );
            }}
          </Measure>
        </div>}
      {isTaskDataError || isPerformanceSchemaError && <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        This is an error alert — <strong>check it out!</strong>
      </Alert>}
      {currentTaskData && tableSchema && <div>
        <DevTable
          provenanceData={currentTaskData}
          tableSchema={tableSchema}
          handleProvenanceNodeClick={handleProvenanceNodeClick}
          handleTagCreation={handleTagCreation}></DevTable>
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
      </div>}

    </div>

  )
};
async function handleTagCreation(participantID, taskID, tag, action) {
  await timeout(200);

  return tag;
};

export default TableDataLoader;
