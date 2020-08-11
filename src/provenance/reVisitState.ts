export interface reState {
  selectedTask: string;
  sortBy: string;
}

export const defaultState: reState = {
  selectedTask: "S-task01",
  sortBy: "name"
};
