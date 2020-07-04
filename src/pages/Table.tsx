import React, { useContext } from "react";
import {
  relativeProvenanceData,
  unrelativeProvenanceData,
} from "../common/data/provenanceMocks.js";
import InputLabel from "@material-ui/core/InputLabel";
import MaterialTableWrapper from "../components/ProvenanceTable";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ProvenanceDataContext from "../components/ProvenanceDataContext";

const Table = ({ location }) => {
  const { allProvenanceData } = useContext(ProvenanceDataContext);
  const [taskId, setTaskId] = React.useState("S-task01");

  function handleChange(event) {
    setTaskId(event.target.value);
  }
  let taskData = React.useMemo(() => {
    let internalTaskData = [];
    allProvenanceData.forEach((participant) => {
      const newObj = Object.assign(
        { id: participant.id },
        participant.data[taskId]
      );

      if (participant.data[taskId]) {
        internalTaskData.push(newObj);
      }
    });
    return internalTaskData;
  }, [allProvenanceData, taskId]);
  console.log("TASK", taskData);

  const valuesArr = [
    { name: "Task 1", key: "S-task01" },
    { name: "Task 2", key: "S-task02" },
    { name: "Task 3", key: "S-task03" },
    { name: "Task 4", key: "S-task04" },
    { name: "Task 5", key: "S-task05" },
    { name: "Task 6", key: "S-task06" },
    { name: "Task 7", key: "S-task07" },
    { name: "Task 8", key: "S-task08" },
    { name: "Task 9", key: "S-task09" },
    { name: "Task 10", key: "S-task10" },
    { name: "Task 11", key: "S-task11" },
    { name: "Task 12", key: "S-task12" },
    { name: "Task 13", key: "S-task13" },
    { name: "Task 14", key: "S-task14" },
    { name: "Task 15", key: "S-task15" },
    { name: "Task 16", key: "S-task16" },
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
          value={taskId}
          onChange={handleChange}
          label="name">
          {valuesArr.map((value) => {
            return (
              <MenuItem key={value.key} value={value.key}>
                {value.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <MaterialTableWrapper provenanceData={taskData} />
    </div>
  );
};

export default Table;
