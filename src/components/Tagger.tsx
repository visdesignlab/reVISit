import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

const initialState = {
  mouseX: null,
  mouseY: null,
};

export default function Tagger({ text = undefined, tagDivId, rowData }) {
  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const [tags, setTags] = useState([]);
  const [remove, setRemove] = useState();
  console.log(text, tags);
  text =
    text ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ipsum purus, bibendum sit  amet vulputate eget, porta semper ligula. Donec bibendum vulputate erat, ac fringilla mi   finibus nec. Donec ac dolor sed dolor porttitor blandit vel vel purus. Fusce vel malesuada   ligula. Nam quis vehicula ante, eu finibus est. Proin ullamcorper fermentum orci, quis   finibus massa. Nunc lobortis, massa ut rutrum ultrices, metus metus finibus ex, sit amet   facilisis neque enim sed neque. Quisque accumsan metus vel maximus consequat. Suspendisse  lacinia tellus a libero volutpat maximus";

  //    console.log('text is ', text)
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log(window.getSelection().toString());
    // console.log(window.getSelection().toString().length,remove)
    if (window.getSelection().toString().length > 0 || remove) {
      setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    }
  };

  //on mouse up select that input box.

  const handleClose = () => {
    let tag = window.getSelection().toString();
    setRemove(undefined);
    //   console.log(text.split(tag))
    if (tag.length > 0) {
      let currentTags = [...tags];
      currentTags.push(tag);
      setTags(currentTags);
    }
    if (document.getElementById(tagDivId)?.querySelectorAll("input")) {
      setTimeout(function () {
        document.getElementById(tagDivId).querySelectorAll("input")[0].focus();
      }, 500);
    }

    setState(initialState);
  };

  const removeTag = () => {
    let tag = remove;
    let currentTags = [...tags];
    let newTags = currentTags.filter((t) => t != tag);

    setRemove(undefined);
    setTags(newTags);

    setState(initialState);
  };
  let taggedText = text;
  // console.log(typeof(text))
  tags.map((t) => {
    console.log("before", taggedText);

    taggedText = taggedText.replace(t, "<tag>>" + t + "<tag>");
    console.log("after", taggedText);
  });
  console.log(taggedText);

  return (
    <div onMouseUp={handleClick}>
      {tags.length > 0 ? (
        <Typography>
          {" "}
          {taggedText.split("<tag>").map((t, i) => {
            if (t[0] == ">") {
              t = t.substring(1);
              console.log(rowData.tags, i);
              return (
                <Tooltip title={"Interesting Pattern"}>
                  <span
                    onMouseDown={() => setRemove(t)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(255 153 0 / 24%)",
                    }}>
                    {t}
                  </span>
                </Tooltip>
              );
            } else {
              return <span>{t}</span>;
            }
          })}
          {/* {text.split(tags).map((t, i) => {
              return <><span>{t}</span><Tooltip title={'Interesting Pattern'}><span onClick={()=>setRemove(true)} style={{backgroundColor: "rgb(255 153 0 / 24%)"}}>{tags}</span></Tooltip></>
          })}  */}
        </Typography>
      ) : (
        <Typography>{text}</Typography>
      )}
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }>
        {remove ? (
          <MenuItem onClick={removeTag}>Remove Tag</MenuItem>
        ) : (
          <MenuItem onClick={handleClose}>Tag</MenuItem>
        )}
      </Menu>
    </div>
  );
}
