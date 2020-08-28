import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from "@material-ui/core/Typography";


export default function CheckBox({condition,visible,checkBoxCallback}) {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (evt) => {

    evt.stopPropagation(); 
    checkBoxCallback(condition,evt.target.checked)
    setChecked(evt.target.checked);
  };
  return (condition && visible ? <>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        color="default"
        inputProps={{ 'aria-label': 'checkbox with default color' }}
      />
      <Typography
                            // style={{ display: "block" }}
                            color="primary"
                            variant="overline">
                            {condition}
                        </Typography>
      </> :null)
    
    {/* <div>
      
      <Checkbox
        defaultChecked
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
      <Checkbox disabled inputProps={{ 'aria-label': 'disabled checkbox' }} />
      <Checkbox disabled checked inputProps={{ 'aria-label': 'disabled checked checkbox' }} />
      <Checkbox
        defaultChecked
        indeterminate
        inputProps={{ 'aria-label': 'indeterminate checkbox' }}
      />
      <Checkbox
        defaultChecked
        color="default"
        inputProps={{ 'aria-label': 'checkbox with default color' }}
      />
      <Checkbox
        defaultChecked
        size="small"
        inputProps={{ 'aria-label': 'checkbox with small size' }}
      />
    </div> */}

}