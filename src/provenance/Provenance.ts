import { Extra, initProvenance, isStateNode, NodeID, Provenance, StateNode, isChildNode } from '@visdesignlab/trrack';
import { reState, defaultState } from "./reVisitState"

export const provenance = initProvenance<reState, unknown, unknown>(defaultState, false);

export interface contextSetFunctions {
  selectedTaskFunction: (tasks: string[]) => void;
}

export function setupProvenance(
  contextFunctions: contextSetFunctions
){
  provenance.addObserver(["selectedTask"], (state: reState) => {
    contextFunctions.selectedTaskFunction([state.selectedTask]);
  })

  // setting up undo/redo keys to ctrl z/ shift ctrl z
  document.onkeydown = function(e){
    var mac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

    if(!e.shiftKey && (mac ? e.metaKey : e.ctrlKey) && e.which == 90){
      undo();
    }
    else if(e.shiftKey && (mac ? e.metaKey : e.ctrlKey) && e.which == 90){
      redo();
    }
  }

  function undo(){
    if(isChildNode(provenance.current()))
    {
      provenance.goBackOneStep();
    }
  }

  function redo(){
    if(provenance.current().children.length == 0){
      return;
    }
    provenance.goToNode(provenance.current().children[provenance.current().children.length - 1])
  }

}
