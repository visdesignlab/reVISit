import React, { useState } from "react";
import ChartGeneratorWithClick from "./ChartGeneratorWithClick";
import CircleGeneratorWithClick from "./CircleGeneratorWithClick";
import _ from "lodash";

const LinkedView = ({ data }) => {
  // This is our state. When state is changed (via the setter 'setSelectedDataIndicies')
  // this component will be re-rendered. This allows us to pass information from child to parent.
  const [selectedDataIndicies, setSelectedDataIndicies] = useState([]);

  // this is a handler. We pass this to the children components to call when a data point is clicked
  // calling this function will change the selectedDataIndicies state variable, causing re-render of
  // the LinkedView component
  function handleDataIndexClick(index) {
    const indexInCurrentlySelectedPoints = selectedDataIndicies.indexOf(index);

    // note: we create a copy rather than directly editing the state variable as we must only
    // change the state variable using the setter tied to it.
    let copyOfSelectedIndicies = _.cloneDeep(selectedDataIndicies);

    // if point is already selected, remove it from selected array
    if (indexInCurrentlySelectedPoints > -1) {
      copyOfSelectedIndicies.splice(indexInCurrentlySelectedPoints, 1);
    } else {
      copyOfSelectedIndicies.push(index);
    }

    // if we wanted to add provenance tracking, we could do that here

    // passing the new value to the setter will set selectedDataIndicies = copyOfSelectedIndicies

    setSelectedDataIndicies(copyOfSelectedIndicies);

    // note: this doesn't happen automatically if you try to access selectedDataIndicies right here
    // you would get the old value, but if you're accessing it outside of this handler, it will have
    // updated it's by then
  }

  return (
    <div>
      <ChartGeneratorWithClick
        data={data}
        selectedDataIndicies={selectedDataIndicies}
        handleClick={handleDataIndexClick}
      ></ChartGeneratorWithClick>
      <CircleGeneratorWithClick
        data={data}
        selectedDataIndicies={selectedDataIndicies}
        handleClick={handleDataIndexClick}
      ></CircleGeneratorWithClick>
    </div>
  );
};

export default LinkedView;
