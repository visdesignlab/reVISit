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
  const { currentTaskData, handleProvenanceNodeClick } = useContext(
    ProvenanceDataContext
  );

  let [isLoading, isError, schemaFromServer] = useFetchAPIData(async () => {
    return await getSchema("Performance");
  }, []);
  console.log(isLoading, isError, schemaFromServer);

  const metricsSchema = false;
  const dependenciesLoaded = !!(currentTaskData.length > 0 && metricsSchema);
  return dependenciesLoaded ? (
    <DevTable
      provenanceData={currentTaskData}
      handleProvenanceNodeClick={handleProvenanceNodeClick}></DevTable>
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
