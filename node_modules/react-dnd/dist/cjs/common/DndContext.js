"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDndContext = createDndContext;
exports.DndContext = void 0;

var React = _interopRequireWildcard(require("react"));

var _dndCore = require("dnd-core");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Create the React Context
 */
var DndContext = React.createContext({
  dragDropManager: undefined
});
/**
 * Creates the context object we're providing
 * @param backend
 * @param context
 */

exports.DndContext = DndContext;

function createDndContext(backend, context, options, debugMode) {
  return {
    dragDropManager: (0, _dndCore.createDragDropManager)(backend, context, options, debugMode)
  };
}