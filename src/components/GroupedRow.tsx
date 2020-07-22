/* eslint-disable no-unused-vars */
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import * as React from "react";
/* eslint-enable no-unused-vars */

export const CustomGroupRow = (props) => {
  console.log("DYWOOTTO", props);

  return (
    <>
      <TableRow>
        <div className="card d-flex flex-row align-items-center justify-content-between p-4">
          <div className="flex-column d-flex text-left">
            <span className="text-muted mb-2">Value</span>
            <span className="text-primary">{props.groupData.value}</span>
          </div>
          <span className="d-flex align-items-center">
            {props.groupData.data.length} Result{" "}
            <IconButton
              style={{
                transition: "all ease 200ms",
                ...rotateIconStyle(props.groupData.isExpanded),
              }}
              onClick={(event) => {
                props.onGroupExpandChanged(props.path);
              }}>
              <props.icons.DetailPanel />
            </IconButton>
          </span>
        </div>
      </TableRow>
    </>
  );
};

CustomGroupRow.defaultProps = {
  columns: [],
  groups: [],
  options: {},
  level: 0,
};

CustomGroupRow.propTypes = {
  actions: PropTypes.array,
  columns: PropTypes.arrayOf(PropTypes.object),
  components: PropTypes.object,
  detailPanel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  getFieldValue: PropTypes.func,
  groupData: PropTypes.object,
  groups: PropTypes.arrayOf(PropTypes.object),
  hasAnyEditingRow: PropTypes.bool,
  icons: PropTypes.object,
  isTreeData: PropTypes.bool.isRequired,
  level: PropTypes.number,
  localization: PropTypes.object,
  onGroupExpandChanged: PropTypes.func,
  onRowSelected: PropTypes.func,
  onRowClick: PropTypes.func,
  onToggleDetailPanel: PropTypes.func.isRequired,
  onTreeExpandChanged: PropTypes.func.isRequired,
  onEditingCanceled: PropTypes.func,
  onEditingApproved: PropTypes.func,
  options: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.number),
};
