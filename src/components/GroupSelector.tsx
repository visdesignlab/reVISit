/* eslint-disable no-use-before-define */
import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { OmitProps } from 'antd/lib/transfer/ListBody';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '700px',
        '& > * + *': {
            marginTop: theme.spacing(3),
        },
    },
}));

export default function Tags(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Autocomplete
                multiple
                id="tags-standard"
                options={props.groups}
                getOptionLabel={(option) => option.name}
                // defaultValue={[top100Films[13]]}
                value={props.value}
                // renderTags={function (value) { console.log('value', value); return value }}
                onChange={function (event, value, reason) {
                    props.onChange(value, reason)
                }}
                renderInput={(params) => {
                    return <TextField
                        {...params}
                        variant="standard"
                        label="Events"
                        placeholder="Add Event to Group"
                    />
                }}
            />
        </div>
    );
}
