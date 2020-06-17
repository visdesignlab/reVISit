import React from "react";
import ReactTags from "react-tag-autocomplete";

const TagWrapper = ({ tags, onTagChange }) => {
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
    />
  );
};

export default TagWrapper;
