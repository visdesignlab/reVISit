import React from "react";
import { relativeProvenanceData } from "../common/data/provenanceMocks.js";
import InputLabel from "@material-ui/core/InputLabel";

import MaterialTableWrapper from "../components/ProvenanceTable";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const Table = ({ location }) => {
  const [taskIndex, setTaskIndex] = React.useState(0);

  function handleChange(event) {
    console.log(event);
    setTaskIndex(event.target.value);
  }
  let newData = relativeProvenanceData[taskIndex].map((dataArr) => {
    console.log("in rerunnew data");
    return { provGraph: dataArr };
  });
  for (let i = 0; i < 0; i++) {
    newData = newData.concat(_.cloneDeep(newData));
  }
  const valuesArr = [
    { name: "Task 1", key: 0 },
    { name: "Task 2", key: 1 },
    { name: "Task 3", key: 2 },
    { name: "Task 4", key: 3 },
    { name: "Task 5", key: 4 },
    { name: "Task 6", key: 5 },
    { name: "Task 7", key: 6 },
    { name: "Task 8", key: 7 },
    { name: "Task 9", key: 8 },
  ];

  return (
    <div>
      <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">
          Selected Task
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={taskIndex}
          onChange={handleChange}
          label="name">
          {valuesArr.map((value) => {
            return <MenuItem value={value.key}>{value.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <MaterialTableWrapper provenanceData={newData} />
    </div>
  );
};

export default Table;
