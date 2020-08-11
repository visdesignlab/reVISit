import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import { Provenance } from "@visdesignlab/trrack";
import { reState } from "../provenance/reVisitState";

import { provenance } from "../provenance/Provenance";

const ProvenanceTrrackContext = React.createContext({});

export const ProvenanceTrrackContextProvider = ({ children }) => {
  //State
  const [selectedTaskIds, setSelectedTaskIds] = React.useState(["S-task01"]);

  function handleChangeSelectedTaskId(event) {

    let action = provenance.addAction("Changing selected task", (state: reState) => {
      state.selectedTask = event.target.value;
      return state;
    })

    action.applyAction();
  }

  return (
    <ProvenanceTrrackContext.Provider
      value={{
        selectedTaskIds,
        setSelectedTaskIds,
        handleChangeSelectedTaskId
      }}>
      {children}
    </ProvenanceTrrackContext.Provider>
  );
};

export default ProvenanceTrrackContext;
