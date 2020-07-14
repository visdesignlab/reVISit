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
      autofocus={false}
      tags={tags}
      allowNew={true}
      handleDelete={handleDeleteTag}
      handleAddition={handleAddTag}
    />
  );
};
export default TagWrapper;
