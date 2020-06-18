import React from "react";
import ReactTags from "react-tag-autocomplete";
import "./reacttags.css";

const TagWrapper = ({ tags, onTagChange, isMaster }) => {
  function handleAddTag(tag) {
    onTagChange("Add", tag);
  }
  function handleDeleteTag(i) {
    const allTags = tags.slice(0);
    const tag = allTags.splice(i, 1);
    onTagChange("Delete", tag);
  }
  return (
    <ReactTags
      tags={tags}
      allowNew={true}
      handleDelete={handleDeleteTag}
      handleAddition={handleAddTag}
      tagComponent={TagComponent}
    />
  );
};
const TagComponent = (props) => {
  const { value, onDelete } = props;
  return (
    <React.Fragment>
      <div className={"react-tags__selected-tag-name"}>{value}</div>
    </React.Fragment>
  );
};
export default TagWrapper;
