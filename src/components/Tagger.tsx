import React, {useState} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Tooltip from "@material-ui/core/Tooltip";


const initialState = {
  mouseX: null,
  mouseY: null,
};

export default function Tagger({text=undefined}) {
  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const [tags,setTags] = useState('')

   text = text ||  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ipsum purus, bibendum sit  amet vulputate eget, porta semper ligula. Donec bibendum vulputate erat, ac fringilla mi   finibus nec. Donec ac dolor sed dolor porttitor blandit vel vel purus. Fusce vel malesuada   ligula. Nam quis vehicula ante, eu finibus est. Proin ullamcorper fermentum orci, quis   finibus massa. Nunc lobortis, massa ut rutrum ultrices, metus metus finibus ex, sit amet   facilisis neque enim sed neque. Quisque accumsan metus vel maximus consequat. Suspendisse  lacinia tellus a libero volutpat maximus"

//    console.log('text is ', text)
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = () => {
      let tag = window.getSelection().toString()
    //   console.log(text.split(tag))

    setTags(tag)
    setState(initialState);
  };

  const removeTag = () => {
    let tag = window.getSelection().toString()
  //   console.log(text.split(tag))

  setTags('')
  setState(initialState);
};

  return (
    <div onContextMenu={handleClick} style={{ cursor: 'context-menu' }}>
         {tags.length > 0? <Typography> {text.split(tags).map((t, i) => {
              return <><span>{t}</span><Tooltip title={'Interesting Pattern'}><span style={{backgroundColor: "rgb(255 153 0 / 24%)"}}>{tags}</span></Tooltip></>
          })} </Typography> : 
          <Typography>{text}</Typography>}
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={removeTag}>Remove Tag</MenuItem>
        <MenuItem onClick={handleClose}>Tag</MenuItem>
      </Menu>
    </div>
  );
}
