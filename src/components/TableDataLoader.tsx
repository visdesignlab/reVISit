import React, { useContext, useEffect, useState } from "react";
import DevTable from "./DevExtremeTable";
import ProvenanceDataContext from "./ProvenanceDataContext";
import Skeleton from "@material-ui/lab/Skeleton";
import LoaderStyles from "./TableDataLoader.module.css";
import Measure from "react-measure";
import { getSchema } from "../fetchers/fetchMocks";
import { useFetchAPIData } from "../hooks/hooks";

const TableDataLoader = (props) => {
  const [height, setHeight] = useState(1000);
  const {
    currentTaskData,
    handleProvenanceNodeClick,
    handleTagCreation,
  } = useContext(ProvenanceDataContext);
  const [tableSchema, setTableSchema] = useState(null);

  let [isLoading, isError, schemaFromServer] = useFetchAPIData(async () => {
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
  const dependenciesLoaded = !!(
    currentTaskData &&
    currentTaskData.length > 0 &&
    tableSchema
  );

  return dependenciesLoaded ? (
    <DevTable
      provenanceData={currentTaskData}
      tableSchema={tableSchema}
      handleProvenanceNodeClick={handleProvenanceNodeClick}
      handleTagCreation={handleTagCreation}></DevTable>
  ) : (
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
    </div>
  );
};

export default TableDataLoader;
